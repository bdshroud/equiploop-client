import { betterAuth } from "better-auth";
import { MongoClient, Db, Collection, CollectionOptions } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import type { BetterAuthSession, BetterAuthUser } from "@/types";

const dbName = process.env.DB_NAME || "equiploop";

// MongoClient internals used by the driver to detect closed/destroyed clients.
type ClientInternals = {
  s?: { hasBeenClosed?: boolean };
  topology?: {
    isDestroyed?: () => boolean;
    s?: { state?: string };
  };
};

// Bound method/property reader for the Mongo driver proxies below.
type AnyFn = (this: unknown, ...args: never[]) => unknown;
function readBoundProp(target: object, prop: string | symbol): unknown {
  const raw = (target as unknown as Record<string, unknown>)[prop as string];
  return typeof raw === "function" ? (raw as AnyFn).bind(target) : raw;
}

// Global MongoClient caching with auto-reconnection for serverless lifecycle
let cachedClient: MongoClient | null = null;

function isClientDead(client: MongoClient | null): boolean {
  if (!client) return true;
  const internals = client as unknown as ClientInternals;
  if (internals.s?.hasBeenClosed) return true;
  if (internals.topology == null && internals.s?.hasBeenClosed) return true;
  if (internals.topology?.isDestroyed?.()) return true;
  if (internals.topology?.s?.state === "closed") return true;
  return false;
}

export function getMongoClient(): MongoClient {
  const uri = process.env.DB_URI || "";
  if (!uri) {
    throw new Error("Missing DB_URI environment variable");
  }

  const globalAny = globalThis as unknown as { _mongoClient?: MongoClient };
  if (!cachedClient) {
    cachedClient = globalAny._mongoClient || null;
  }

  if (isClientDead(cachedClient)) {
    try {
      cachedClient?.close().catch(() => {});
    } catch {}
    cachedClient = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    globalAny._mongoClient = cachedClient;
  }

  return cachedClient!;
}

function getActiveDb(): Db {
  return getMongoClient().db(dbName);
}

// Proxies ensuring database and collection operations always route to an active client
const dbProxy = new Proxy({} as Db, {
  get(_target, prop: string | symbol) {
    if (prop === "collection") {
      return (name: string, options?: CollectionOptions): Collection =>
        new Proxy({} as Collection, {
          get(_colTarget, colProp: string | symbol) {
            const activeCol = getActiveDb().collection(name, options);
            return readBoundProp(activeCol, colProp);
          },
        });
    }
    return readBoundProp(getActiveDb(), prop);
  },
});

const clientProxy = new Proxy({} as MongoClient, {
  get(_target, prop: string | symbol) {
    return readBoundProp(getMongoClient(), prop);
  },
});

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://equiploop-client.vercel.app";
};

const baseURL = getBaseURL();

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || "g7XTA7cm2cboK3nbXpeN85Wg48ZVKeuI",
  trustedOrigins: [
    "http://localhost:3000",
    "https://equiploop-client.vercel.app",
    baseURL,
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.NEXT_PUBLIC_API_URL,
  ].filter(Boolean) as string[],
  database: mongodbAdapter(dbProxy, { client: clientProxy }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "Customer",
        input: false, // Prevents users from passing role during signup
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      address: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // Assignment rule: min 6 chars + uppercase + lowercase
    requireEmailVerification: false, // Explicitly disabled per assignment guidelines
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            accessType: "offline",
            prompt: "select_account",
          },
        }
      : {}),
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user as unknown as BetterAuthUser).role ?? "Customer",
        }),
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
  },
});

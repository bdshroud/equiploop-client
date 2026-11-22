import { betterAuth } from "better-auth";
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const uri = process.env.DB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "equiploop";

// Global MongoClient caching across hot-reloads and Vercel serverless lambdas
const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
};

if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });
}

const client = globalForMongo._mongoClient;
const db = client.db(dbName);

const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://equiploop-client.vercel.app";
};

const baseURL = getBaseURL();

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
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
  database: mongodbAdapter(db, { client }),
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
          role: user.role ?? "Customer",
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

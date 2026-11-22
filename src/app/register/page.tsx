"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { apiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState(false);
  // Validate assignment password rule: min 6 chars, uppercase, lowercase
  const validatePassword = (pass: string) => {
    if (pass.length < 6) return "Password must be at least 6 characters long";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      toast.error(passError);
      return;
    }

    try {
      setLoading(true);
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: undefined,
        phone: phone.trim(),
        address: address.trim(),
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Welcome to EquipLoop.");
      router.push("/dashboard/rentals");
      router.refresh();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Sign up error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setSocialLoading(true);
      const callbackURL =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard/rentals`
          : "/dashboard/rentals";

      const res = await signIn.social({
        provider: "google",
        callbackURL,
      });

      if (res?.error) {
        toast.error(res.error.message || "Google sign up failed");
        return;
      }

      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Google sign up could not be initiated"));
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem-12rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-lg shadow-xl border-border bg-card">
        <CardHeader className="text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-graphite dark:bg-amber text-amber dark:text-graphite mx-auto flex items-center justify-center font-bold shadow-xs">
            <Wrench className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            Create an EquipLoop Account
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Join verified contractors and fleet operators across North America.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            disabled={socialLoading}
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 font-semibold text-xs h-11 border-border"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-2 text-[11px] font-semibold text-muted-foreground uppercase">
              Or register with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Full Name / Business Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g. John Miller or Miller Civil Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Work Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="contractor@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Min 6 characters, uppercase + lowercase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 text-xs"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Must be at least 6 characters and contain uppercase & lowercase letters.
              </p>
            </div>

            {/* Phone & Address in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="(512) 555-0144"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Austin, TX"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full font-bold bg-amber text-graphite hover:bg-amber/90 text-sm mt-3"
            >
              {loading ? "Creating Account..." : "Create Free Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-amber hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

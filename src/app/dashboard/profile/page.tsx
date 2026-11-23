"use client";

import * as React from "react";
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle2, Upload } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { profileEditSchema } from "@/lib/schemas";
import { uploadToImgBB } from "@/lib/upload";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session } = useSession();

  const role = session?.user?.role || "Customer";

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [image, setImage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      toast.info("Uploading avatar to ImgBB...");
      const res = await uploadToImgBB(file);
      if (res.success && res.url) {
        setImage(res.url);
        toast.success("Avatar uploaded! Remember to save changes.");
      } else {
        toast.error(res.error || "Failed to upload avatar");
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to upload avatar"));
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchApi<{
          success: boolean;
          data: { name: string; phone?: string; address?: string; image?: string };
        }>("/users/profile");
        if (res.data) {
          setName(res.data.name || "");
          setPhone(res.data.phone || "");
          setAddress(res.data.address || "");
          setImage(res.data.image || "");
        }
      } catch (err) {
        if (session?.user) {
          setName(session.user.name || "");
          setPhone(session.user.phone || "");
          setAddress(session.user.address || "");
          setImage(session.user.image || "");
        }
      }
    }
    loadProfile();
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileEditSchema.safeParse({ name, phone, address });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the highlighted fields");
      return;
    }
    try {
      setLoading(true);
      await fetchApi("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, phone, address, image }),
      });
      toast.success("Account profile updated successfully");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update profile"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1">
          Identity & Contact Details
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your personal details, dispatcher phone, and operating address.
        </p>
      </div>

      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-amber/40">
              <AvatarImage src={image} />
              <AvatarFallback className="bg-graphite text-white font-bold text-lg">
                {name ? name.slice(0, 2).toUpperCase() : "EL"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold">{name || session?.user?.name}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {session?.user?.email}
              </CardDescription>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge variant="amber" className="text-[10px]">
                  Role: {role}
                </Badge>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Verified Identity
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Full Name / Legal Entity
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Account Email (Read-only)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="pl-9 text-xs bg-muted/60 opacity-80"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Dispatch Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="(512) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Primary Business / Yard Address
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground">
                  Avatar Photo (ImgBB Upload / Direct Link)
                </label>
                <div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="h-7 text-[11px] px-2.5 font-semibold text-amber-text border-amber/40 hover:bg-amber/10"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    {uploadingAvatar ? "Uploading..." : "Upload to ImgBB"}
                  </Button>
                </div>
              </div>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/... or uploaded ImgBB URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs mt-2"
            >
              {loading ? "Saving Changes..." : "Save Profile Details"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

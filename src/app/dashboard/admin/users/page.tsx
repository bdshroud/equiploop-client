"use client";

import * as React from "react";
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Building,
  UserX,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface PlatformUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "Customer" | "Owner" | "Admin";
  phone?: string;
  address?: string;
  status?: "Active" | "Suspended";
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<PlatformUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All");

  const loadUsers = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter !== "All") params.set("role", roleFilter);

      const res = await fetchApi<{ success: boolean; data: PlatformUser[] }>(`/users?${params.toString()}`);
      if (res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      console.warn("Failed to load users:", err.message);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId: string, newRole: "Customer" | "Owner" | "Admin") => {
    try {
      await fetchApi(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      toast.success(`User role changed to ${newRole}`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const handleStatusChange = async (userId: string, status: "Active" | "Suspended") => {
    try {
      await fetchApi(`/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`User status changed to ${status}`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">
          Identity Governance
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Platform User Management
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage member accounts, promote users to Equipment Owner or Admin roles, and enforce moderation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground hidden sm:inline">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber w-full sm:w-auto"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customer Only</option>
            <option value="Owner">Owner Only</option>
            <option value="Admin">Admin Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border bg-card">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold">No users found matching query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => {
            const uid = u._id || u.id || "";
            return (
              <Card key={uid} className="p-4 rounded-xl border-border bg-card shadow-xs hover:border-amber/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{u.name}</h3>
                      <Badge
                        variant={u.role === "Admin" ? "destructive" : u.role === "Owner" ? "amber" : "secondary"}
                        className="text-[10px]"
                      >
                        {u.role}
                      </Badge>
                      {u.status === "Suspended" && (
                        <Badge variant="destructive" className="text-[10px]">
                          Suspended
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {u.email}
                      </span>
                      {u.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {u.phone}
                        </span>
                      )}
                      <span>Joined {formatDate(u.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions: Change Role & Change Status */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border justify-end">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(uid, e.target.value as any)}
                      className="h-8 px-2.5 rounded-md border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber"
                    >
                      <option value="Customer">Role: Customer</option>
                      <option value="Owner">Role: Owner</option>
                      <option value="Admin">Role: Admin</option>
                    </select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(uid, u.status === "Suspended" ? "Active" : "Suspended")}
                      className={`h-8 px-2.5 text-xs font-semibold ${
                        u.status === "Suspended" ? "text-emerald-600 hover:bg-emerald-50" : "text-destructive hover:bg-destructive/10"
                      }`}
                    >
                      {u.status === "Suspended" ? "Activate" : "Suspend"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

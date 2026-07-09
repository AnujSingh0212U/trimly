"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface UserRow {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  role: string;
  _count: { urls: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch("/api/admin/list?type=users")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUsers(json.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (id: string, action: "suspend" | "unsuspend" | "delete") => {
    const method = action === "delete" ? "DELETE" : "PATCH";
    const body = action !== "delete" ? JSON.stringify({ action }) : undefined;
    const res = await fetch(`/api/admin/users/${id}`, { method, body, headers: { "Content-Type": "application/json" } });
    const json = await res.json();
    if (!json.success) {
      toast.error(json.error?.message);
      return;
    }
    toast.success(`User ${action}d`);
    fetchUsers();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.firstName} {user.lastName} · {user._count.urls} links · {user.status}
                </p>
              </div>
              <div className="flex gap-2">
                {user.status === "ACTIVE" ? (
                  <Button size="sm" variant="outline" onClick={() => handleAction(user.id, "suspend")}>
                    Suspend
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleAction(user.id, "unsuspend")}>
                    Unsuspend
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => handleAction(user.id, "delete")}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

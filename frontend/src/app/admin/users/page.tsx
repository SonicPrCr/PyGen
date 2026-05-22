"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminBtn } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface User {
  id: number;
  email: string;
  username: string;
  current_level: number;
  xp: number;
  is_staff: boolean;
  is_active: boolean;
}

export default function AdminUsersPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);

  const load = () => {
    api.get("/api/admin/users").then((r) => {
      setUsers(r.data as User[]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const toggleStaff = async (user: User) => {
    setToggling(user.id);
    try {
      const resp = await api.patch(`/api/admin/users/${user.id}`, { is_staff: !user.is_staff });
      const updated = resp.data as User;
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_staff: updated.is_staff } : u));
    } finally {
      setToggling(null);
    }
  };

  const toggleActive = async (user: User) => {
    setToggling(user.id);
    try {
      const resp = await api.patch(`/api/admin/users/${user.id}`, { is_active: !user.is_active });
      const updated = resp.data as User;
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: updated.is_active } : u));
    } finally {
      setToggling(null);
    }
  };

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Пользователи" />
      <div className="p-6">
        <AdminCard>
          {loading ? (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Загрузка...</div>
          ) : (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>ID</AdminTh>
                  <AdminTh>Email</AdminTh>
                  <AdminTh>Имя</AdminTh>
                  <AdminTh>Уровень</AdminTh>
                  <AdminTh>XP</AdminTh>
                  <AdminTh>Статус</AdminTh>
                  <AdminTh>Действия</AdminTh>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <AdminTd>
                      <span style={{ color: "var(--color-text-muted)" }}>#{user.id}</span>
                    </AdminTd>
                    <AdminTd>
                      <span className="text-white">{user.email}</span>
                    </AdminTd>
                    <AdminTd>{user.username}</AdminTd>
                    <AdminTd>{user.current_level} lvl</AdminTd>
                    <AdminTd>{user.xp} XP</AdminTd>
                    <AdminTd>
                      <div className="flex flex-col gap-1">
                        {user.is_staff && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{ backgroundColor: "rgba(105,94,176,0.2)", color: "var(--color-accent-purple-light)" }}
                          >
                            Админ
                          </span>
                        )}
                        {!user.is_active && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171" }}
                          >
                            Заблокирован
                          </span>
                        )}
                        {user.is_active && !user.is_staff && (
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Пользователь
                          </span>
                        )}
                      </div>
                    </AdminTd>
                    <AdminTd>
                      <div className="flex items-center gap-2">
                        <AdminBtn
                          variant="ghost"
                          disabled={toggling === user.id}
                          onClick={() => toggleStaff(user)}
                        >
                          {user.is_staff ? "Снять админа" : "Сделать админом"}
                        </AdminBtn>
                        <AdminBtn
                          variant={user.is_active ? "danger" : "ghost"}
                          disabled={toggling === user.id}
                          onClick={() => toggleActive(user)}
                        >
                          {user.is_active ? "Заблокировать" : "Разблокировать"}
                        </AdminBtn>
                      </div>
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          )}
        </AdminCard>
      </div>
    </div>
  );
}

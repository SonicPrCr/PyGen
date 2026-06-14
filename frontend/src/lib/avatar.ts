export function getAvatarUrl(avatar: string | null | undefined): string | null {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return `${base}${avatar}`;
}

export function normalizeAuthUser<T extends { avatar: string | null }>(user: T): T {
  return { ...user, avatar: getAvatarUrl(user.avatar) };
}

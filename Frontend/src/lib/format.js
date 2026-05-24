export function formatUsername(username) {
  if (!username) return "";
  const clean = username.replace(/^@+/, "");
  return `@${clean}`;
}

import useAuth from "@/service/auth";

export async function Logout() {
  const _auth = useAuth();
  const res = await _auth.logout();
  if (res.logout) {
    window.location.href = "/login";
    return;
  }

  return;
}

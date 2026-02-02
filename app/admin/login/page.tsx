import { login } from "@/features/admin/actions";
import { AdminLoginForm } from "@/features/admin";

export default function AdminLoginPage() {
  return <AdminLoginForm action={login} />;
}

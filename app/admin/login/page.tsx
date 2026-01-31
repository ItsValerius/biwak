import { login } from "../actions";
import { AdminLoginForm } from "@/components/admin";

export default function AdminLoginPage() {
  return <AdminLoginForm action={login} />;
}

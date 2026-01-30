import { login } from "../actions";
import { AdminLoginForm } from "./admin-login-form";

export default function AdminLoginPage() {
  return <AdminLoginForm action={login} />;
}

"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword, setAdminSession } from "@/features/auth";
import { ERROR_MESSAGE } from "@/lib/constants";

export async function login(prevState: unknown, formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || !password.trim()) {
    return { error: ERROR_MESSAGE.PASSWORD_REQUIRED };
  }
  if (!verifyAdminPassword(password)) {
    return { error: ERROR_MESSAGE.INVALID_PASSWORD };
  }
  await setAdminSession();
  redirect("/admin");
}

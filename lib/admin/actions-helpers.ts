import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasAdminSession } from "@/lib/auth";

export async function requireAdmin() {
  const ok = await hasAdminSession();
  if (!ok) redirect("/admin/login");
}

export function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/");
}

type ZodErrorTree = {
  errors?: string[];
  properties?: Record<string, ZodErrorTree>;
  items?: (ZodErrorTree | undefined)[];
};

export function getFirstError(tree: ZodErrorTree): string | undefined {
  if (tree.errors?.[0]) return tree.errors[0];
  if (tree.properties) {
    for (const v of Object.values(tree.properties)) {
      const first = getFirstError(v);
      if (first) return first;
    }
  }
  if (tree.items) {
    for (const item of tree.items) {
      if (item) {
        const first = getFirstError(item);
        if (first) return first;
      }
    }
  }
  return undefined;
}

export function parseZodError(error: z.ZodError, fallback: string): string {
  const tree = z.treeifyError(error);
  return getFirstError(tree) ?? fallback;
}

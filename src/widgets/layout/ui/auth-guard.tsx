import { useAuth } from "@/shared/providers/auth";
import { usePathname, redirect } from "next/navigation";
import { PropsWithChildren } from "react";
const UN_AUTH_PAGES = ["/"];
export function AuthGuard({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { isAuth } = useAuth();

  if (isAuth && !UN_AUTH_PAGES.includes(pathname ?? "")) {
    redirect("/");
  }

  if (!isAuth && UN_AUTH_PAGES.includes(pathname ?? "")) {
    redirect("/login");
  }

  return children;
}

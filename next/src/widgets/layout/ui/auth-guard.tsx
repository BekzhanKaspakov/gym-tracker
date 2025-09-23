import { useAuth } from "@/shared/providers/auth";
import { usePathname, redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const UN_AUTH_PAGES = ["/register", "/login"];

export function AuthGuard({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { isAuth, isLoading } = useAuth();

  if (!isLoading && isAuth && UN_AUTH_PAGES.includes(pathname ?? "")) {
    redirect("/");
  }

  if (!isLoading && !isAuth && !UN_AUTH_PAGES.includes(pathname ?? "")) {
    redirect("/login");
  }

  return children;
}

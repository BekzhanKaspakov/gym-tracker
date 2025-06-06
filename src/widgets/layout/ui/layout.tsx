"use client";
import { AuthProvider } from "@/shared/providers/auth";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthGuard } from "./auth-guard";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import { Header } from "@/widgets/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGuard>
          <Header />

          <main
            className={`${geistSans.variable} ${geistMono.variable} antialiased relative grow`}
          >
            <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-8 laptop:py-6 ">
              {children}
            </div>
          </main>
        </AuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
};

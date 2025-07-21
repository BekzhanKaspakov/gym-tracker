import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/widgets/layout";

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Gains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

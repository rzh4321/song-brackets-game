import type { Metadata } from "next";
import "@/app/globals.css";
import Provider from "@/components/Provider";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/home");
  }
  return (
    <html lang="en">
      <Provider>
        <body className="dark">{children}</body>
      </Provider>
    </html>
  );
}

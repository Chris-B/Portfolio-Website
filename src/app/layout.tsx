import "@/styles/globals.css";

import { type Metadata } from "next";
import { type ReactNode } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Chris Barclay",
  description: "Software Development Portfolio",
  authors: [{ name: "Chris Barclay", url: "chrisbarclay.dev" }],
  publisher: "Data Dynamics LLC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full w-full" >
      <body className="h-full w-full bg-black" >
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

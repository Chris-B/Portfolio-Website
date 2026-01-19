import "@/styles/globals.css";

import { type Metadata } from "next";
import { type ReactNode } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import QueryProvider from "@/providers/query-provider";

import { Geist, Geist_Mono } from 'next/font/google'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

/**
 * Root Metadata
 * 
 * @returns Root Metadata for the application.
 */
export const metadata: Metadata = {
  title: 'Chris Barclay | Immersive 3D Portfolio',
  description: 'An experimental React Three Fiber experience featuring immersive 3D environments and a virtual avatar you can interview.',
  authors: [{ name: "Chris Barclay", url: "chrisbarclay.dev" }],
  publisher: "Data Dynamics LLC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

/**
 * Root Layout
 * Sets up the TanStack Query provider, header, and footer.
 * 
 * @returns Root Layout
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full w-full" >
      <body className="h-full w-full bg-black font-sans" >
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

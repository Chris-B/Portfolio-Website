import "~/styles/globals.css";

import { type Metadata } from "next";

import { AvatarStoreProvider } from "~/providers/avatar-store-provider"
import { VideoStoreProvider } from "~/providers/video-store-provider"
import Footer from "~/components/footer";

import Navigation from "~/components/header";

import { TRPCReactProvider } from '~/trpc/react'
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Chris Barclay",
  description: "Software Development Portfolio",
  authors: [{name: "Chris Barclay", url: "chrisbarclay.dev"}],
  publisher: "Data Dynamics LLC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <TRPCReactProvider>
        <html lang="en" className="h-full w-full" >
          <body className="h-full w-full bg-black" >
            <HydrateClient>
              <AvatarStoreProvider>
                <VideoStoreProvider>
                <Navigation/>
                {children}
                <Footer/>
                </VideoStoreProvider>
              </AvatarStoreProvider>
            </HydrateClient>
          </body>
        </html>
      </TRPCReactProvider>
  );
}

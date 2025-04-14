import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Memories",
  description: "Share your memory photo frame with your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`${GeistSans.className} bg-neutral-100 text-neutral-800 antialiased`}
      >
        {children}
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

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
      <body
        className={`${GeistSans.className} bg-neutral-100 text-neutral-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

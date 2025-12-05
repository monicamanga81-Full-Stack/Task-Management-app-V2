import type { Metadata, Viewport } from "next"; // Import Viewport type
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. Standard Metadata
export const metadata: Metadata = {
  title: "Task Manager App",
  description: "My productivity application",
  manifest: "/manifest.json", // Correct
};

// 2. Viewport & Theme Color (New separate export)
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

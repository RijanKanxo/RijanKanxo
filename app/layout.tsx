import type { Metadata } from "next";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  title: "Rijan Kapur Poudel | Designer & Developer",
  description:
    "Portfolio of Rijan Kapur Poudel, a frontend developer and designer from Chitwan, Nepal."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

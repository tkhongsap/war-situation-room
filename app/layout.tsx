import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SITUATION ROOM | Global Intelligence Dashboard",
  description: "Real-time global intelligence and market signal monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

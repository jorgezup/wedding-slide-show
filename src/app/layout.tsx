import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eiva e Jorge - 14/02/2026",
  description: "Compartilhe sua foto conosco - Casamento Eiva e Jorge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

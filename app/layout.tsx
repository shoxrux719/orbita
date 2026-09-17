import type { Metadata } from "next";
import "./globals.css";
import "./modules.css";
import "./expansion.css";
import "./redesign.css";

export const metadata: Metadata = {
  title: "ORBIT — английский в твоём ритме",
  description: "Изучай английский: грамматика, словарь, чтение, speaking и тренажёр печати.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}

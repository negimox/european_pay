import type { Metadata } from "next";
import { Pacifico, Quicksand } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Pacifico({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | UniEvents",
    default: "UniEvents",
  },
  description:
    "UniEvents: Your college event management portal. Discover events, register easily, and stay updated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} min-h-full flex flex-col bg-background text-foreground`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

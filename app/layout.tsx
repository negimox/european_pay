import type { Metadata } from "next";
import { Inter, Young_Serif } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const young_serif = Young_Serif({
  variable: "--font-young",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${young_serif.className} ${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}

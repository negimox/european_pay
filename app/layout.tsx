import type { Metadata } from "next";
import { Google_Sans_Flex, Young_Serif } from "next/font/google";
import "./globals.css";
const google_sans_flex = Google_Sans_Flex({
  variable: "--font-google_sans_flex",
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
      className={`dark ${young_serif.className} ${google_sans_flex.variable} h-full antialiased`}
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
        {children}
      </body>
    </html>
  );
}

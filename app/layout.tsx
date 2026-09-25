import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sarcaworks.com.br"),

  title: {
    default: "SARÇA WORKS | Estúdio Criativo",
    template: "%s | SARÇA WORKS",
  },

  description:
    "Design, digital e experiências interativas para ideias que merecem existir.",

  keywords: [
    "SARÇA WORKS",
    "estúdio criativo",
    "design",
    "design digital",
    "sites",
    "convites interativos",
    "identidade visual",
    "experiências digitais",
  ],

  authors: [
    {
      name: "SARÇA WORKS",
    },
  ],

  creator: "SARÇA WORKS",

  icons: {
    icon: "/sarça%20logo.png",
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://sarcaworks.com.br",
    siteName: "SARÇA WORKS",
    title: "SARÇA WORKS | Estúdio Criativo",
    description:
      "Design, digital e experiências interativas para ideias que merecem existir.",
  },

  twitter: {
    card: "summary",
    title: "SARÇA WORKS | Estúdio Criativo",
    description:
      "Design, digital e experiências interativas para ideias que merecem existir.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
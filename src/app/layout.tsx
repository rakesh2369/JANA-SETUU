import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "JanSetu — AI-Powered Government Scheme Discovery and Access Platform",
  description:
    "A centralised, transparent, and AI-grounded gateway to discover government welfare schemes, scholarships, agriculture subsidies, and pensions across Andhra Pradesh and Bharat.",
  keywords: [
    "JanSetu",
    "Government Schemes",
    "Andhra Pradesh Welfare",
    "Jagananna Vidya Deevena",
    "YSR Rythu Bharosa",
    "YSR Aarogyasri",
    "YSR Cheyutha",
    "YSR Pension Kanuka",
    "AP Schemes",
    "PM Vishwakarma",
    "Scholarships",
    "Subsidies",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-navy-900 font-sans antialiased selection:bg-teal-500 selection:text-white">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

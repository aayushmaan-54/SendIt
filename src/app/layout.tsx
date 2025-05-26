import type { Metadata } from "next";
import { Spline_Sans_Mono } from "next/font/google";
import { ThemeProvider } from "@/common/providers/theme-provider";
import cn from "@/common/utils/cn";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import Footer from "@/common/components/footer";
import Header from "@/common/components/header";
import { Toaster } from "react-hot-toast";
import "./globals.css";


const splineSansMono = Spline_Sans_Mono({
  variable: "--font-splineSansMono",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sendit-file.vercel.app"),
  title: {
    default: "SendIt - Secure, Instant File Sharing",
    template: "SendIt | %s",
  },
  description:
    "SendIt 📤 is a lightweight file-sharing platform with instant link generation, QR codes, password protection",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📤</text></svg>",
  },
  openGraph: {
    title: "SendIt - Secure, Instant File Sharing",
    description:
      "Share files securely in seconds with SendIt: custom links, QR codes, password & OTP protection, expiry by time or downloads.",
    url: "https://sendit-file.vercel.app",
    siteName: "SendIt",
    images: [
      {
        url: "/sendit-og.png",
        width: 1200,
        height: 630,
        alt: "SendIt - File sharing made easy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SendIt - Secure, Instant File Sharing",
    description:
      "Instantly upload and share files with SendIt. Get custom links, QR codes, password & OTP protection, and full expiry controls.",
    images: ["/sendit-og.png"],
  },
  keywords: [
    "SendIt",
    "SendIt App",
    "Secure File Sharing",
    "File Upload Platform",
    "Instant File Link",
    "Custom Download Link",
    "QR Code File Sharing",
    "Password Protected Files",
    "OTP File Access",
    "Email Based File Access",
    "One-Time File Share",
    "File Expiry Options",
    "Time Based File Deletion",
    "Download Limit File",
    "File Sharing with Expiry",
    "Track Downloads and IP",
    "File Access Logs",
    "Device Info of Downloader",
    "Multi-Device File Access",
    "Private File Sharing",
    "SaaS File Transfer",
    "Modern File Sharing App",
    "Secure Document Transfer",
    "File Access Control",
    "Cloud File Sharing",
    "Fast File Upload",
    "Share Files Instantly",
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          splineSansMono.variable,
          splineSansMono.className,
          "antialiased bg-primary text-primary-text font-splineSansMono flex flex-col items-center min-h-screen overflow-x-hidden"
        )}
      >
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <div className="flex flex-col min-h-screen w-full">
            <main className="flex-1 flex flex-col items-center w-full">
              <Header />
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

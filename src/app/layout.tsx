import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Bitburg — The DMV's vetted media marketplace",
  description:
    "Vetted photographers, videographers, and editors for local sports, events, and creative work in DC, Maryland, and Virginia. Join the waitlist for early access.",
  openGraph: {
    title: "Bitburg — The DMV's vetted media marketplace",
    description:
      "Booking media in the DMV, without the DMs. Join the waitlist for early access.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
          <Nav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

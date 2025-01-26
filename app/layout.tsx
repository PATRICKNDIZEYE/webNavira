import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Logo } from "@/components/logo";
import ContactFormDialog from "@/components/Contact";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NAVIRA - AI Search Interface",
    description: "A minimalist, AI-driven search experience",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-[#0a0118] text-white min-h-screen flex flex-col`}>

        <main className="flex-1">
            <div className="flex justify-end mt-5 mr-2">
            <ContactFormDialog
                />
            </div>
            <Logo />
            {children}
        </main>
        <Toaster />
        </body>
        </html>
    );
}
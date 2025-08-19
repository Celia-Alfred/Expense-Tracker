import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import { Outfit } from "next/font/google";
import "./globals.css";
import FooterWrapper from "./_components/FooterWrapper"; // ✅ Fixed path

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "A-Expense Tracker",
  description: "Track your budgets and expenses effortlessly",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={5000}
            expand
          />
          {children}
          <FooterWrapper />
        </body>
      </html>
    </ClerkProvider>
  );
}

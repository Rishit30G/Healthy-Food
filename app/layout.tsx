import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Healthy Food",
  description: "Discover the best dishes curated for you",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-green-800/10`}
      >
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet"></link>
          {/* <Header /> */}
        <main className="min-h-screen">{children}</main>
        <footer className="bg-green-600/15 py-5">
        <div className="container mx-auto text-center text-green-800 outfit-regular flex items-center justify-center">
            <p className="flex items-center">
              Made for 
              <img className="inline-block object-contain size-12 mb-2" src="/vege.gif" alt="Vegetable"/>
              consumers
            </p>
          </div>
        </footer>
      </body>
    </html>
    
  );
}

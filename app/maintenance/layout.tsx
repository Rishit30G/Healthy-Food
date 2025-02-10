import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthy Food",
  description: "Discover the best dishes curated for you",
};

export default function MaintenanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-green-800/10 flex items-center justify-center">
     {children}
    </main>
  );
}

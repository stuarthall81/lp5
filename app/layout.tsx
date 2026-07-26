import BottomNavigation from "@/components/BottomNavigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="pb-20">
        {children}
        <BottomNavigation />
      </body>
    </html>
  );
}
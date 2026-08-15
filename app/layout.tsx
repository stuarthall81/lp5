import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import { getCurrentPlayer } from "@/lib/currentPlayer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const player = await getCurrentPlayer();

  return (
    <html lang="en">
      <body className="pb-20">
        {children}

        <BottomNavigation
          isAdmin={player?.is_admin ?? false}
        />
      </body>
    </html>
  );
}

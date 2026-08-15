import { redirect } from "next/navigation";
import { getCurrentPlayer } from "@/lib/currentPlayer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const player = await getCurrentPlayer();

  if (!player?.is_admin) {
    redirect("/");
  }

  return <>{children}</>;
}

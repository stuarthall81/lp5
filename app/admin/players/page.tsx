import Link from "next/link";
import AdminPlayersManager from "@/components/AdminPlayersManager";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPlayersPage() {
  const supabase = createAdminClient();

  const { data: players, error } = await supabase
    .from("players")
    .select(
      "id, display_name, mobile, golf_link_number, is_admin, active"
    )
    .order("display_name");

  if (error) {
    throw error;
  }

  return (
    <main className="min-h-screen bg-green-100 px-4 py-8 pb-24">
      <div className="w-full max-w-4xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">
            Player Management
          </h1>

          <p className="text-gray-600 mt-2">
            Add and manage Lowes Park Fivers players.
          </p>
        </div>

        <AdminPlayersManager
          players={players ?? []}
        />

        <Link
          href="/admin"
          className="block text-center text-green-700 font-semibold"
        >
          ← Back to Admin
        </Link>

      </div>
    </main>
  );
}

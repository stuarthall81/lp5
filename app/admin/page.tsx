import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8 pb-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center">
          ⛳ Lowes Park Fivers Admin
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-8">
          Administration
        </p>

        <div className="space-y-4">

          <Link
            href="/admin/players"
            className="block w-full bg-blue-700 text-white rounded-xl py-4 text-center font-semibold"
          >
            👥 Manage Players
          </Link>

          <Link
            href="/admin/competition"
            className="block w-full bg-green-700 text-white rounded-xl py-4 text-center font-semibold"
          >
            ⛳ Manage Competition
          </Link>

          <Link
            href="/admin/competitions/new"
            className="block w-full bg-gray-800 text-white rounded-xl py-4 text-center font-semibold"
          >
            ➕ Create Competition
          </Link>

        </div>

      </div>
    </main>
  );
}

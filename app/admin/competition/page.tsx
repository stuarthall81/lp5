import Link from "next/link";
import { getCompetitions } from "@/lib/db/competitions";

export default async function AdminCompetitionPage() {
  const competitions = await getCompetitions();

  const sortedCompetitions = [...competitions].sort(
    (a, b) =>
      new Date(b.competition_date).getTime() -
      new Date(a.competition_date).getTime()
  );

  return (
    <main className="min-h-screen bg-green-100 px-4 py-8 pb-24">
      <div className="w-full max-w-3xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold">
            Manage Competitions
          </h1>

          <p className="text-gray-600 mt-2">
            Select a competition to manage entries,
            scores and status.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Competitions
          </h2>

          {sortedCompetitions.length === 0 ? (
            <p className="text-gray-600">
              No competitions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">
                      Competition
                    </th>

                    <th className="text-left py-2 px-2">
                      Date
                    </th>

                    <th className="text-left py-2 px-2">
                      Status
                    </th>

                    <th className="text-right py-2 pl-2">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedCompetitions.map(
                    (competition) => (
                      <tr
                        key={competition.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-3 pr-4">
                          <p className="font-medium">
                            {competition.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {competition.course}
                          </p>
                        </td>

                        <td className="py-3 px-2 whitespace-nowrap">
                          {competition.competition_date}
                        </td>

                        <td className="py-3 px-2">
                          {competition.status}
                        </td>

                        <td className="py-3 pl-2 text-right">
                          <Link
                            href={`/admin/competition/${competition.id}`}
                            className="text-blue-700 font-semibold"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

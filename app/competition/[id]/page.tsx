import { competitions } from "@/data/competitions";

type CompetitionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CompetitionPage({
  params,
}: CompetitionPageProps) {
  const { id } = await params;

  const competition = competitions.find(
    (c) => c.id === id
  );

  if (!competition) {
    return (
      <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-red-600">
            Competition not found
          </h1>

          <p className="mt-4">
            No competition exists with ID:
          </p>

          <p className="font-semibold mt-2">{id}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center">
          ⛳ Competition
        </h1>

        <div className="mt-8 space-y-4">

          <h2 className="text-2xl font-bold">
            {competition.name}
          </h2>

          <p>📍 {competition.course}</p>

          <p>📅 {competition.date}</p>

          <p>💷 £{competition.entryFee}</p>

        </div>

      </div>
    </main>
  );
}

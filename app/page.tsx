export default function Home() {
  return (
    <main className="min-h-screen bg-green-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">

        <div className="bg-green-700 text-white p-6">
          <h1 className="text-3xl font-bold">🏌️ Fairway Live</h1>
          <p className="mt-2 opacity-90">
            Wednesday Stableford
          </p>
          <p className="opacity-80">
            Royal Lytham
          </p>
        </div>

        <div className="p-6">

          <div className="mb-6">
            <p className="text-sm text-gray-500">Competition Status</p>
            <p className="text-green-700 font-bold text-lg">
              🟢 OPEN
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
            <h2 className="font-semibold">
              Leaderboard
            </h2>

            <p className="mt-2">
              🔒 Hidden until 4:00 pm
            </p>
          </div>

          <div className="space-y-5">

            <label className="flex items-center justify-between">
              <span>Playing</span>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="flex items-center justify-between">
              <span>Paid</span>
              <input type="checkbox" />
            </label>

            <div>
              <label className="block mb-2">
                Net Score
              </label>

              <input
                type="number"
                className="w-full rounded-lg border p-3"
                placeholder="Enter score"
              />
            </div>

            <button className="w-full rounded-lg bg-green-700 text-white py-3 font-semibold hover:bg-green-800">
              Submit Score
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}
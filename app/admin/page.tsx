"use client";

import { useState } from "react";

export default function AdminPage() {
  const [competitionName, setCompetitionName] = useState("Proude Cup");
  const [course, setCourse] = useState("Lowes Park White");
  const [date, setDate] = useState("25 July 2026");
  const [entryFee, setEntryFee] = useState("5");
  const [competitionLink, setCompetitionLink] = useState("");

   function createCompetition() {
  const formattedDate = date.replace(/\s+/g, "-").toLowerCase();

  const slug =
    competitionName
      .toLowerCase()
      .replace(/\s+/g, "-");

  const link = `/competition/${formattedDate}-${slug}`;

  setCompetitionLink(link);

  console.log({
    competitionName,
    course,
    date,
    entryFee,
    link,
  });
}


  return (
    <main className="min-h-screen bg-green-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center">
          ⛳ Lowes Park Fivers Admin
        </h1>

        <h2 className="text-xl font-semibold mt-8 mb-6">
          Create Competition
        </h2>

        <label className="block mb-2 font-medium">
          Competition Name
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-5"
          value={competitionName}
          onChange={(e) => setCompetitionName(e.target.value)}
        />

        <label className="block mb-2 font-medium">
          Course
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-5"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <label className="block mb-2 font-medium">
          Date
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-5"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label className="block mb-2 font-medium">
          Entry Fee (£)
        </label>

        <input
          className="w-full border rounded-lg p-3 mb-8"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
        />

        <button
  onClick={createCompetition}
  className="w-full bg-green-700 text-white rounded-xl py-3 text-lg font-semibold"
>
  Create Competition
</button>

        {competitionLink && (
  <div className="mt-8 rounded-lg bg-green-100 p-4">

    <p className="font-semibold">
      Competition created!
    </p>

    <p className="mt-2 text-sm break-all">
      {competitionLink}
    </p>

  </div>
)}

      </div>
    </main>
  );
}

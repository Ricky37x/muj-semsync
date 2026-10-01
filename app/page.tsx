"use client";

import Link from "next/link";
import { useState } from "react";

type Subject = {
  id: number;
  name: string;
  attended: number;
  total: number;
};

const initialSubjects: Subject[] = [
  {
    id: 1,
    name: "Data Structures",
    attended: 34,
    total: 40,
  },
  {
    id: 2,
    name: "Circuits & Systems",
    attended: 29,
    total: 38,
  },
  {
    id: 3,
    name: "Digital Electronics",
    attended: 41,
    total: 45,
  },
  {
    id: 4,
    name: "Statistics",
    attended: 27,
    total: 36,
  },
  {
    id: 5,
    name: "Engineering Economics",
    attended: 27,
    total: 36,
  },
  {
    id: 6,
    name: "Computer Architecture",
    attended: 27,
    total: 36,
  },
  {
    id: 7,
    name: "EDC",
    attended: 27,
    total: 36,
  },
  {
    id: 8,
    name: "DSA Lab",
    attended: 27,
    total: 36,
  },
  {
    id: 9,
    name: "EDC Lab",
    attended: 27,
    total: 36,
  },
  {
    id: 10,
    name: "DE Lab",
    attended: 27,
    total: 36,
  },
];

const TARGET = 0.75;

function getPercentage(attended: number, total: number) {
  if (total <= 0) return 0;

  return (attended / total) * 100;
}

function getCanMiss(attended: number, total: number) {
  if (total <= 0) return 0;

  return Math.max(
    0,
    Math.floor(attended / TARGET - total)
  );
}

function getClassesNeeded(attended: number, total: number) {
  if (total <= 0) return 0;

  if (attended / total >= TARGET) {
    return 0;
  }

  return Math.ceil(
    (TARGET * total - attended) / (1 - TARGET)
  );
}

function getStatus(attended: number, total: number) {
  const canMiss = getCanMiss(attended, total);

  if (canMiss >= 1) {
    return "safe";
  }

  const classesNeeded = getClassesNeeded(
    attended,
    total
  );

  if (classesNeeded <= 1) {
    return "borderline";
  }

  return "critical";
}

function getStatusText(
  status: string,
  attended: number,
  total: number
) {
  const canMiss = getCanMiss(attended, total);
  const classesNeeded = getClassesNeeded(
    attended,
    total
  );

  if (status === "safe") {
    return `You can miss ${canMiss} ${
      canMiss === 1 ? "class" : "classes"
    } and stay above 75%.`;
  }

  if (status === "borderline") {
    if (attended / total >= TARGET) {
      return "You cannot miss another class without falling below 75%.";
    }

    return "Attend your next class to reach the 75% target.";
  }

  return `You need to attend the next ${classesNeeded} ${
    classesNeeded === 1 ? "class" : "classes"
  } to reach 75%.`;
}

export default function Home() {
  const [subjects] = useState<Subject[]>(
    initialSubjects
  );

  /* =========================
     SLCM SYNC DEMO
  ========================= */

  const [slcmUsername, setSlcmUsername] =
    useState("");

  const [slcmPassword, setSlcmPassword] =
    useState("");

  const [syncing, setSyncing] =
    useState(false);

  const [syncResult, setSyncResult] = useState<
    "idle" | "failed"
  >("idle");

  function handleSlcmSync() {
    setSyncing(true);
    setSyncResult("idle");

    setTimeout(() => {
      setSyncing(false);
      setSyncResult("failed");
    }, 1000);
  }

  /* =========================
     ATTENDANCE PLANNER
  ========================= */

  const [plannerAttended, setPlannerAttended] =
    useState(29);

  const [plannerConducted, setPlannerConducted] =
    useState(40);

  const [plannedMisses, setPlannedMisses] =
    useState(0);

  const [classesRemaining, setClassesRemaining] =
    useState(20);

  /* =========================
     OVERALL ATTENDANCE
  ========================= */

  const totalAttended = subjects.reduce(
    (sum, subject) =>
      sum + subject.attended,
    0
  );

  const totalClasses = subjects.reduce(
    (sum, subject) =>
      sum + subject.total,
    0
  );

  const overallAttendance =
    getPercentage(
      totalAttended,
      totalClasses
    );

  /* =========================
     SUBJECT STATUS COUNTS
  ========================= */

  const safeCount = subjects.filter(
    (subject) =>
      getStatus(
        subject.attended,
        subject.total
      ) === "safe"
  ).length;

  const borderlineCount =
    subjects.filter(
      (subject) =>
        getStatus(
          subject.attended,
          subject.total
        ) === "borderline"
    ).length;

  const criticalCount =
    subjects.filter(
      (subject) =>
        getStatus(
          subject.attended,
          subject.total
        ) === "critical"
    ).length;

  /* =========================
     PLANNER CALCULATIONS
  ========================= */

  const safeAttended = Math.max(
    0,
    Math.min(
      plannerAttended,
      plannerConducted
    )
  );

  const safeConducted = Math.max(
    0,
    plannerConducted
  );

  const safeRemaining = Math.max(
    0,
    classesRemaining
  );

  const safeMisses = Math.max(
    0,
    Math.min(
      plannedMisses,
      safeRemaining
    )
  );

  const plannedAttended =
    safeRemaining - safeMisses;

  const finalAttended =
    safeAttended + plannedAttended;

  const finalConducted =
    safeConducted + safeRemaining;

  const projectedAttendance =
    finalConducted > 0
      ? (finalAttended /
          finalConducted) *
        100
      : 0;

  /* =========================
     CLASSES NEEDED TO FINISH
  ========================= */

  const classesNeededToFinish =
    (() => {
      if (safeRemaining === 0) {
        return safeConducted > 0 &&
          safeAttended /
            safeConducted >=
            TARGET
          ? 0
          : null;
      }

      if (safeConducted === 0) {
        return null;
      }

      const needed = Math.ceil(
        (
          TARGET *
            (safeConducted +
              safeRemaining) -
          safeAttended
        ) /
          (1 - TARGET)
      );

      return Math.max(
        0,
        Math.min(
          needed,
          safeRemaining
        )
      );
    })();

  /* =========================
     MAXIMUM MISSES
  ========================= */

  const maximumMisses =
    (() => {
      if (
        safeRemaining === 0 ||
        safeConducted <= 0
      ) {
        return 0;
      }

      const maxMisses =
        Math.floor(
          safeRemaining -
            (
              TARGET *
                (safeConducted +
                  safeRemaining) -
              safeAttended
            ) /
              (1 - TARGET)
        );

      return Math.max(
        0,
        Math.min(
          maxMisses,
          safeRemaining
        )
      );
    })();

  const additionalMissesAvailable =
    Math.max(
      0,
      maximumMisses -
        safeMisses
    );

  /* =========================
     PLANNER STATUS
  ========================= */

  const plannerStatus =
    projectedAttendance >= 80
      ? "safe"
      : projectedAttendance >= 75
        ? "borderline"
        : "critical";

  const plannerStyles = {
    safe: {
      text: "text-emerald-400",
      bg: "bg-emerald-400",
      label: "Safe",
    },

    borderline: {
      text: "text-yellow-400",
      bg: "bg-yellow-400",
      label: "Borderline",
    },

    critical: {
      text: "text-red-400",
      bg: "bg-red-400",
      label: "Critical",
    },
  };

  const plannerStyle =
    plannerStyles[plannerStatus];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            37
          </Link>

          <div className="flex items-center gap-2 text-sm">

            <Link
              href="/"
              className="rounded-lg bg-white/10 px-4 py-2 text-white"
            >
              Attendance
            </Link>

            <Link
              href="/gpa"
              className="rounded-lg px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              GPA
            </Link>

            <Link
              href="/timetable"
              className="rounded-lg px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Timetable
            </Link>

          </div>

        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* =========================
            HEADER
        ========================= */}

        <section>

          <p className="text-sm font-medium text-zinc-500">
            
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            
          </h1>

          <p className="mt-2 text-zinc-400">
            
          </p>

        </section>

        {/* =========================
            SUMMARY
        ========================= */}

        <section className="mt-10 grid gap-4 md:grid-cols-2">

          {/* OVERALL */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-sm text-zinc-500">
              Overall Attendance
            </p>

            <p className="mt-3 text-5xl font-semibold">
              {overallAttendance.toFixed(1)}%
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              {totalAttended} attended /{" "}
              {totalClasses} conducted
            </p>

          </div>

          {/* STATUS */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-sm text-zinc-500">
              Subject Status
            </p>

            <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between">

                <span className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                  Safe

                </span>

                <span className="font-semibold text-emerald-400">
                  {safeCount}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />

                  Borderline

                </span>

                <span className="font-semibold text-yellow-400">
                  {borderlineCount}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />

                  Critical

                </span>

                <span className="font-semibold text-red-400">
                  {criticalCount}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            SLCM SYNC
        ========================= */}

        <section className="mt-8">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-semibold">
                    SLCM Sync
                  </h2>

                  <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
                    
                  </span>

                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  
                </p>

              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-500">
                
              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {/* USERNAME */}

              <div>

                <label className="text-sm text-zinc-400">
                  SLCM Username(poora daaliyo)
                </label>

                <input
                  type="text"
                  value={slcmUsername}
                  onChange={(e) => {
                    setSlcmUsername(
                      e.target.value
                    );
                    setSyncResult("idle");
                  }}
                  placeholder="Enter your SLCM username"
                  autoComplete="username"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-700 focus:border-white/30"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-sm text-zinc-400">
                  SLCM Password
                </label>

                <input
                  type="password"
                  value={slcmPassword}
                  onChange={(e) => {
                    setSlcmPassword(
                      e.target.value
                    );
                    setSyncResult("idle");
                  }}
                  placeholder="Enter your SLCM password"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-700 focus:border-white/30"
                />

              </div>

            </div>

            {/* SYNC BUTTON */}

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">

              <button
                type="button"
                onClick={handleSlcmSync}
                disabled={syncing}
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {syncing
                  ? "Syncing..."
                  : "Sync with SLCM"}
              </button>

              {/* FAILED MESSAGE */}

              {syncResult === "failed" && (
                <div className="flex items-center gap-2 text-sm text-red-400">

                  <span className="text-base">
                    ✕
                  </span>

                  <span>
                    <strong>
                      Sync unsuccessful.
                    </strong>{" "}
                    
                  </span>

                </div>
              )}

            </div>

            <p className="mt-4 text-xs leading-5 text-zinc-600">
              
            </p>

          </div>

        </section>

        {/* =========================
            SUBJECTS
        ========================= */}

        <section className="mt-12">

          <h2 className="text-xl font-semibold">
            Your Subjects
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            dekh le attendance
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {subjects.map((subject) => {

              const percentage =
                getPercentage(
                  subject.attended,
                  subject.total
                );

              const status =
                getStatus(
                  subject.attended,
                  subject.total
                );

              const styles =
                plannerStyles[status];

              return (
                <div
                  key={subject.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="font-medium">
                        {subject.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {subject.attended} /{" "}
                        {subject.total} classes
                      </p>

                    </div>

                    <div className="text-right">

                      <p
                        className={`text-2xl font-semibold ${styles.text}`}
                      >
                        {percentage.toFixed(1)}%
                      </p>

                      <p
                        className={`mt-1 text-xs font-medium ${styles.text}`}
                      >
                        {styles.label}
                      </p>

                    </div>

                  </div>

                  {/* PROGRESS BAR */}

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                      className={`h-full rounded-full ${styles.bg}`}
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <p className="mt-4 text-sm text-zinc-400">
                    {getStatusText(
                      status,
                      subject.attended,
                      subject.total
                    )}
                  </p>

                </div>
              );
            })}

          </div>

        </section>

        {/* =========================
            ATTENDANCE PLANNER
        ========================= */}

        <section className="mt-12">

          <div>

            <h2 className="text-xl font-semibold">
              Attendance Planner
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              
            </p>

          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">

            {/* INPUTS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h3 className="font-medium">
                Your situation
              </h3>

              <div className="mt-6 grid gap-5">

                {/* ATTENDED */}

                <div>

                  <label className="text-sm text-zinc-400">
                    Classes attended
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={plannerAttended}
                    onChange={(e) =>
                      setPlannerAttended(
                        Math.max(
                          0,
                          Number(
                            e.target.value
                          )
                        )
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  />

                </div>

                {/* CONDUCTED */}

                <div>

                  <label className="text-sm text-zinc-400">
                    Classes conducted so far
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={plannerConducted}
                    onChange={(e) =>
                      setPlannerConducted(
                        Math.max(
                          1,
                          Number(
                            e.target.value
                          )
                        )
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  />

                </div>

                {/* PLANNED MISSES */}

                <div>

                  <label className="text-sm text-zinc-400">
                    Classes you plan to miss
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={classesRemaining}
                    value={plannedMisses}
                    onChange={(e) =>
                      setPlannedMisses(
                        Math.max(
                          0,
                          Number(
                            e.target.value
                          )
                        )
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  />

                </div>

                {/* REMAINING */}

                <div>

                  <label className="text-sm text-zinc-400">
                    Classes remaining in semester
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={classesRemaining}
                    onChange={(e) => {

                      const value =
                        Math.max(
                          0,
                          Number(
                            e.target.value
                          )
                        );

                      setClassesRemaining(
                        value
                      );

                      setPlannedMisses(
                        (current) =>
                          Math.min(
                            current,
                            value
                          )
                      );
                    }}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                  />

                </div>

              </div>

            </div>

            {/* RESULTS */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-zinc-500">
                    Projected Final Attendance
                  </p>

                  <p
                    className={`mt-2 text-4xl font-semibold ${plannerStyle.text}`}
                  >
                    {projectedAttendance.toFixed(
                      1
                    )}
                    %
                  </p>

                </div>

                <span
                  className={`rounded-full bg-white/5 px-3 py-1 text-sm font-medium ${plannerStyle.text}`}
                >
                  {plannerStyle.label}
                </span>

              </div>

              <div className="mt-8 space-y-5">

                <div className="flex items-center justify-between border-b border-white/10 pb-4">

                  <span className="text-sm text-zinc-500">
                    Remaining classes
                  </span>

                  <span className="font-medium">
                    {safeRemaining}
                  </span>

                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">

                  <span className="text-sm text-zinc-500">
                    Planned misses
                  </span>

                  <span className="font-medium">
                    {safeMisses}
                  </span>

                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">

                  <span className="text-sm text-zinc-500">
                    Classes you must attend
                  </span>

                  <span className="font-medium">
                    {classesNeededToFinish ===
                    null
                      ? "—"
                      : classesNeededToFinish}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-zinc-500">
                    Additional classes you can miss
                  </span>

                  <span className="font-medium">
                    {additionalMissesAvailable}
                  </span>

                </div>

              </div>

              {/* PLANNER MESSAGE */}

              <div
                className={`mt-7 rounded-xl bg-white/[0.04] p-4 text-sm ${plannerStyle.text}`}
              >

                {projectedAttendance >=
                75 ? (
                  <p>
                    With your current plan,
                    you will finish the
                    semester at{" "}
                    <strong>
                      {projectedAttendance.toFixed(
                        1
                      )}
                      %
                    </strong>
                    . You remain above
                    the 75% requirement.
                  </p>
                ) : (
                  <p>
                    detain ho rha hai tu 
                  </p>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-zinc-600">
          sutta peela do 6900917729
        </footer>

      </div>

    </main>
  );
}
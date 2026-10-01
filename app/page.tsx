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
    name: "Mathematics",
    attended: 27,
    total: 36,
  },
];

const TARGET = 0.75;

function getPercentage(attended: number, total: number) {
  if (total === 0) return 0;
  return (attended / total) * 100;
}

function getCanMiss(attended: number, total: number) {
  return Math.max(0, Math.floor(attended / TARGET - total));
}

function getClassesNeeded(attended: number, total: number) {
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

  const classesNeeded = getClassesNeeded(attended, total);

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
  const classesNeeded = getClassesNeeded(attended, total);

  if (status === "safe") {
    return `You can miss ${canMiss} ${
      canMiss === 1 ? "class" : "classes"
    } and stay above 75%.`;
  }

  if (status === "borderline") {
    if (canMiss === 0 && attended / total >= TARGET) {
      return "You cannot miss another class without falling below 75%.";
    }

    return "Attend your next class to reach the 75% target.";
  }

  return `You need to attend the next ${classesNeeded} ${
    classesNeeded === 1 ? "class" : "classes"
  } to reach 75%.`;
}

export default function Home() {
  const [subjects, setSubjects] =
    useState<Subject[]>(initialSubjects);

  const totalAttended = subjects.reduce(
    (sum, subject) => sum + subject.attended,
    0
  );

  const totalClasses = subjects.reduce(
    (sum, subject) => sum + subject.total,
    0
  );

  const overallAttendance = getPercentage(
    totalAttended,
    totalClasses
  );

  const safeCount = subjects.filter(
    (subject) =>
      getStatus(subject.attended, subject.total) === "safe"
  ).length;

  const borderlineCount = subjects.filter(
    (subject) =>
      getStatus(subject.attended, subject.total) ===
      "borderline"
  ).length;

  const criticalCount = subjects.filter(
    (subject) =>
      getStatus(subject.attended, subject.total) ===
      "critical"
  ).length;

  const statusStyles = {
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

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* NAVBAR */}
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

        {/* HEADER */}
        <section>
          <p className="text-sm font-medium text-zinc-500">
            
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Kya likhu yaha pe
          </h1>

          <p className="mt-2 text-zinc-400">
            class jaya kar bsdk nahi hai aur miss 
          </p>
        </section>


        {/* SUMMARY */}
        <section className="mt-10 grid gap-4 md:grid-cols-2">

          {/* OVERALL ATTENDANCE */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-sm text-zinc-500">
              Overall Attendance
            </p>

            <p className="mt-3 text-5xl font-semibold">
              {overallAttendance.toFixed(1)}%
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              {totalAttended} attended / {totalClasses} conducted
            </p>

          </div>


          {/* SUBJECT STATUS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-sm text-zinc-500">
              Subject Status
            </p>

            <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>Safe</span>
                </span>

                <span className="font-semibold text-emerald-400">
                  {safeCount}
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span>Borderline</span>
                </span>

                <span className="font-semibold text-yellow-400">
                  {borderlineCount}
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span>Critical</span>
                </span>

                <span className="font-semibold text-red-400">
                  {criticalCount}
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* SUBJECTS */}
        <section className="mt-12">

          <div>
            <h2 className="text-xl font-semibold">
              Your Subjects
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your attendance situation for each subject.
            </p>
          </div>


          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {subjects.map((subject) => {

              const percentage = getPercentage(
                subject.attended,
                subject.total
              );

              const status = getStatus(
                subject.attended,
                subject.total
              );

              const styles = statusStyles[status];

              return (
                <div
                  key={subject.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >

                  {/* SUBJECT HEADER */}
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="font-medium">
                        {subject.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {subject.attended} / {subject.total} classes
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
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />

                  </div>


                  {/* STATUS MESSAGE */}
                  <div className="mt-4">

                    <p className="text-sm text-zinc-400">
                      {getStatusText(
                        status,
                        subject.attended,
                        subject.total
                      )}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </section>


        {/* FOOTER */}
        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-zinc-600">
          sutta peela do pls
        </footer>

      </div>
    </main>
  );
}
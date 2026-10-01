"use client";

import Link from "next/link";
import { useState } from "react";

type Stream = "CSE" | "ECE";

type Subject = {
  id: number;
  name: string;
  credits: number;
  grade: string;
};

const gradePoints: Record<string, number> = {
  "A+": 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
};

const romanNumerals = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
];

/*
 * Semester credits from the uploaded MUJ curricula.
 */
const semesterCredits: Record<
  Stream,
  Record<number, number>
> = {
  CSE: {
    1: 20,
    2: 20,
    3: 24,
    4: 24,
    5: 24,
    6: 22,
    7: 14,
    8: 12,
  },

  ECE: {
    1: 20,
    2: 20,
    3: 24,
    4: 23,
    5: 24,
    6: 23,
    7: 14,
    8: 12,
  },
};

const curriculum: Record<
  Stream,
  Record<number, { name: string; credits: number }[]>
> = {
  CSE: {
    1: [
      { name: "Engineering Chemistry & Lab", credits: 3 },
      { name: "Calculus & Matrices", credits: 3 },
      { name: "Digital Systems", credits: 3 },
      { name: "Manufacturing Processes", credits: 3 },
      { name: "Problem-Solving Using Computers", credits: 3 },
      { name: "Universal Human Values", credits: 1 },
      { name: "Problem-Solving Using Computers Lab", credits: 1 },
      { name: "Communication Skills", credits: 2 },
      { name: "Engineering Graphics", credits: 1 },
    ],

    2: [
      { name: "Engineering Physics & Lab", credits: 4 },
      { name: "Computational Mathematics", credits: 3 },
      { name: "Environmental Studies", credits: 2 },
      { name: "Fundamentals of Data Structures", credits: 3 },
      { name: "Data Visualization", credits: 2 },
      { name: "Creativity & Innovation IDEA Lab", credits: 2 },
      { name: "Biology for Engineers", credits: 2 },
      { name: "Fundamentals of Data Structure Lab", credits: 1 },
      { name: "Wellness and Community Services", credits: 1 },
    ],

    3: [
      { name: "Probability and Statistics", credits: 3 },
      { name: "Principles of Management", credits: 3 },
      { name: "Data Structures and Algorithms", credits: 4 },
      { name: "Computer Organization and Architecture", credits: 4 },
      { name: "Relational Database Management Systems", credits: 4 },
      { name: "Object Oriented Programming", credits: 4 },
      { name: "Data Structures and Algorithms Lab", credits: 1 },
      { name: "Relational Database Management Systems Lab", credits: 1 },
    ],

    4: [
      { name: "Operating Systems", credits: 4 },
      { name: "Design and Analysis of Algorithms", credits: 4 },
      { name: "Computer Networks", credits: 4 },
      { name: "Artificial Intelligence", credits: 4 },
      { name: "Technical Report Writing", credits: 2 },
      { name: "Design and Analysis of Algorithms Lab", credits: 1 },
      { name: "Computer Networks Lab", credits: 1 },
      { name: "Operating Systems Lab", credits: 1 },
      { name: "Project Based Learning - 1", credits: 3 },
    ],

    5: [
      { name: "Cloud Computing", credits: 4 },
      { name: "Data Science and Machine Learning", credits: 4 },
      { name: "Information System Security", credits: 4 },
      { name: "Software Engineering", credits: 4 },
      { name: "Program Elective 1", credits: 3 },
      { name: "Data Science and Machine Learning Lab", credits: 1 },
      { name: "Project Based Learning - 2", credits: 3 },
      { name: "Software Engineering Lab", credits: 1 },
    ],

    6: [
      { name: "Theory of Computation", credits: 4 },
      { name: "Engineering Economics", credits: 3 },
      { name: "Industry Elective", credits: 3 },
      { name: "Program Elective 2", credits: 3 },
      { name: "Program Elective 3", credits: 3 },
      { name: "Program Elective 4", credits: 3 },
      { name: "Open Elective", credits: 3 },
    ],

    7: [
      { name: "Open Elective 1", credits: 3 },
      { name: "Open Elective 2", credits: 3 },
      { name: "Program Elective 5", credits: 3 },
      { name: "Program Elective 6", credits: 3 },
      {
        name: "Internship (Industry / Research / Industry Certification)",
        credits: 2,
      },
    ],

    8: [
      { name: "Capstone Project", credits: 12 },
    ],
  },

  ECE: {
    1: [
      { name: "Engineering Chemistry & Lab", credits: 3 },
      { name: "Calculus & Matrices", credits: 3 },
      { name: "Electronic Circuits", credits: 3 },
      { name: "Basic Mechanical Engineering", credits: 3 },
      { name: "Problem-Solving Using Computers", credits: 3 },
      { name: "Universal Human Values", credits: 1 },
      { name: "Problem-Solving Using Computers Lab", credits: 1 },
      { name: "Communication Skills", credits: 2 },
      { name: "Engineering Graphics", credits: 1 },
    ],

    2: [
      { name: "Engineering Physics & Lab", credits: 4 },
      { name: "Computational Mathematics", credits: 3 },
      { name: "Environmental Studies", credits: 2 },
      { name: "Electrical Technology", credits: 2 },
      { name: "Engineering Material and Mechanics", credits: 3 },
      { name: "Creativity & Innovation IDEA Lab", credits: 2 },
      { name: "Biology for Engineers", credits: 2 },
      { name: "MATLAB for Engineers Lab", credits: 1 },
      { name: "Wellness and Community Services", credits: 1 },
    ],

    3: [
      { name: "Statistics and Probability", credits: 3 },
      {
        name: "Principles of Management / Engineering Economics",
        credits: 3,
      },
      { name: "Data Structures and Algorithms", credits: 3 },
      { name: "Digital Electronics", credits: 3 },
      { name: "Electronics Devices & Circuits", credits: 3 },
      { name: "Circuits & Systems", credits: 3 },
      { name: "Computer Architecture & Processor", credits: 3 },
      { name: "Data Structures and Algorithms Lab", credits: 1 },
      { name: "Digital Electronics Lab", credits: 1 },
      { name: "Electronics Devices & Circuits Lab", credits: 1 },
    ],

    4: [
      {
        name: "Principles of Management / Engineering Economics",
        credits: 3,
      },
      { name: "Analog Integrated Circuits", credits: 3 },
      { name: "System Design using HDL", credits: 3 },
      { name: "Digital Signal Processing", credits: 3 },
      { name: "Electromagnetic Field Theory", credits: 3 },
      { name: "Integrated Circuits Lab", credits: 1 },
      { name: "System Design using HDL Lab", credits: 1 },
      { name: "Digital Signal Processing Lab", credits: 1 },
      { name: "Project Based Learning - 1", credits: 3 },
      { name: "Technical Writing", credits: 2 },
    ],

    5: [
      { name: "Optical Communication", credits: 3 },
      { name: "Analog & Digital Communication", credits: 3 },
      { name: "Digital VLSI Design", credits: 3 },
      { name: "Microcontroller and Applications", credits: 3 },
      { name: "Program Elective 1", credits: 3 },
      { name: "Program Elective 2", credits: 3 },
      { name: "Optical Communication Lab", credits: 1 },
      { name: "Analog & Digital Communication Lab", credits: 1 },
      { name: "VLSI Design Lab", credits: 1 },
      { name: "Project Based Learning - 2", credits: 3 },
    ],

    6: [
      { name: "Embedded & RTOS", credits: 3 },
      { name: "Antennas", credits: 3 },
      { name: "Control Theory", credits: 3 },
      { name: "Program Elective 3", credits: 3 },
      { name: "Industry Elective", credits: 3 },
      { name: "Embedded & RTOS Lab", credits: 1 },
      { name: "Antenna Simulation & Measurement Lab", credits: 1 },
      { name: "Open Elective 1", credits: 3 },
      { name: "Open Elective 2", credits: 3 },
    ],

    7: [
      { name: "Program Elective 4", credits: 3 },
      { name: "Program Elective 5", credits: 3 },
      { name: "Program Elective 6", credits: 3 },
      {
        name: "Internship (Industry / Research / Industry Certification)",
        credits: 2,
      },
      { name: "Open Elective", credits: 3 },
    ],

    8: [
      { name: "Capstone Project", credits: 12 },
    ],
  },
};

export default function GPA() {
  const [semester, setSemester] =
    useState<number | null>(null);

  const [stream, setStream] =
    useState<Stream | null>(null);

  const [semesterOpen, setSemesterOpen] =
    useState(false);

  const [streamOpen, setStreamOpen] =
    useState(false);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  /*
   * Previous semester
   */
  const [previousGPAs, setPreviousGPAs] =
    useState<Record<number, string>>({});

  /*
   * GPA
   */
  const [targetGPA, setTargetGPA] =
    useState("9.00");

  const [goalSemester, setGoalSemester] =
    useState<number>(8);

  function loadSubjects(
    selectedStream: Stream,
    selectedSemester: number
  ) {
    const courses =
      curriculum[selectedStream][selectedSemester] ?? [];

    setSubjects(
      courses.map((course, index) => ({
        id: index + 1,
        name: course.name,
        credits: course.credits,
        grade: "A",
      }))
    );
  }

  function selectSemester(value: number) {
    setSemester(value);
    setStream(null);
    setSubjects([]);
    setStreamOpen(false);
  }

  function selectStream(value: Stream) {
    setStream(value);

    if (semester) {
      loadSubjects(value, semester);
    }
  }

  function updateGrade(
    id: number,
    grade: string
  ) {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === id
          ? { ...subject, grade }
          : subject
      )
    );
  }

  function updatePreviousGPA(
    semesterNumber: number,
    value: string
  ) {
    setPreviousGPAs((current) => ({
      ...current,
      [semesterNumber]: value,
    }));
  }

  /*
   * Current semester GPA
   */

  const currentSemesterCredits =
    semester && stream
      ? semesterCredits[stream][semester]
      : 0;

  const totalCredits = subjects.reduce(
    (sum, subject) =>
      sum + subject.credits,
    0
  );

  const totalGradePoints =
    subjects.reduce(
      (sum, subject) =>
        sum +
        subject.credits *
          (gradePoints[subject.grade] ?? 0),
      0
    );

  const semesterGPA =
    totalCredits > 0
      ? totalGradePoints / totalCredits
      : 0;

  /*
   * Calculate overall GPA up to current semester.
   *
   * Previous semester GPAs are weighted
   * according to semester credits.
   */

  let completedGradePoints = 0;
  let completedCredits = 0;

  if (stream && semester) {
    for (let i = 1; i < semester; i++) {
      const value = Number(
        previousGPAs[i]
      );

      if (
        !Number.isNaN(value) &&
        value >= 0 &&
        value <= 10
      ) {
        const credits =
          semesterCredits[stream][i];

        completedGradePoints +=
          value * credits;

        completedCredits += credits;
      }
    }

    /*
     * Add projected/current semester.
     */

    completedGradePoints +=
      semesterGPA *
      currentSemesterCredits;

    completedCredits +=
      currentSemesterCredits;
  }

  const overallGPA =
    completedCredits > 0
      ? completedGradePoints /
        completedCredits
      : 0;

  /*
   * GOAL PLANNER
   *
   * Uses all entered previous semester GPAs
   * and current projected semester GPA.
   */

  let goalCurrentPoints = 0;
  let goalCurrentCredits = 0;

  if (stream && semester) {
    for (let i = 1; i <= semester; i++) {
      let gpa = 0;
      let hasValue = false;

      if (i === semester) {
        gpa = semesterGPA;
        hasValue = true;
      } else {
        const value = Number(
          previousGPAs[i]
        );

        if (
          !Number.isNaN(value) &&
          value >= 0 &&
          value <= 10
        ) {
          gpa = value;
          hasValue = true;
        }
      }

      if (hasValue) {
        const credits =
          semesterCredits[stream][i];

        goalCurrentPoints +=
          gpa * credits;

        goalCurrentCredits += credits;
      }
    }
  }

  const numericTarget =
    Number(targetGPA);

  let requiredFutureGPA = 0;
  let futureCredits = 0;
  let goalPossible = true;

  if (
    stream &&
    semester &&
    goalSemester > semester
  ) {
    for (
      let i = semester + 1;
      i <= goalSemester;
      i++
    ) {
      futureCredits +=
        semesterCredits[stream][i];
    }

    const requiredPoints =
      numericTarget *
        (goalCurrentCredits +
          futureCredits) -
      goalCurrentPoints;

    requiredFutureGPA =
      futureCredits > 0
        ? requiredPoints / futureCredits
        : 0;

    goalPossible =
      requiredFutureGPA <= 10;
  }

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
              className="rounded-lg px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Attendance
            </Link>

            <Link
              href="/gpa"
              className="rounded-lg bg-white/10 px-4 py-2 text-white"
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
            GPA calc
          </h1>

          <p className="mt-2 text-zinc-400">
            
          </p>

        </section>


        {/* ACADEMIC DETAILS */}

        <section className="mt-10 max-w-2xl">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              semester? stream?
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              
            </p>


            {/* SEMESTER DROPDOWN */}

            <div className="relative mt-6">

              <label className="mb-2 block text-sm text-zinc-400">
                Semester
              </label>

              <button
                onClick={() => {
                  setSemesterOpen(
                    !semesterOpen
                  );
                  setStreamOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3.5 text-left transition hover:border-white/20"
              >

                <span
                  className={
                    semester
                      ? "text-white"
                      : "text-zinc-500"
                  }
                >
                  {semester
                    ? `Semester ${
                        romanNumerals[
                          semester
                        ]
                      }`
                    : "Select Semester"}
                </span>

                <span
                  className={`text-zinc-500 transition ${
                    semesterOpen
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ↓
                </span>

              </button>


              {semesterOpen && (

                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111113] p-1 shadow-2xl">

                  {romanNumerals
                    .slice(1)
                    .map(
                      (
                        roman,
                        index
                      ) => {

                        const value =
                          index + 1;

                        return (

                          <button
                            key={value}
                            onClick={() => {
                              selectSemester(
                                value
                              );

                              setSemesterOpen(
                                false
                              );
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition ${
                              semester ===
                              value
                                ? "bg-white text-black"
                                : "text-zinc-300 hover:bg-white/10"
                            }`}
                          >

                            <span>
                              Semester{" "}
                              {roman}
                            </span>

                            {semester ===
                              value && (
                              <span>
                                ✓
                              </span>
                            )}

                          </button>

                        );
                      }
                    )}

                </div>

              )}

            </div>


            {/* STREAM DROPDOWN */}

            {semester && (

              <div className="mt-6">

                <label className="mb-2 block text-sm text-zinc-400">
                  Stream
                </label>

                <div className="relative">

                  <button
                    onClick={() =>
                      setStreamOpen(
                        !streamOpen
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3.5 text-left transition hover:border-white/20"
                  >

                    <span
                      className={
                        stream
                          ? "text-white"
                          : "text-zinc-500"
                      }
                    >
                      {stream
                        ? stream === "CSE"
                          ? "CSE — Computer Science & Engineering"
                          : "ECE — Electronics & Communication Engineering"
                        : "Select Stream"}
                    </span>

                    <span
                      className={`text-zinc-500 transition ${
                        streamOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ↓
                    </span>

                  </button>


                  {streamOpen && (

                    <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111113] p-1 shadow-2xl">

                      <button
                        onClick={() => {
                          selectStream(
                            "CSE"
                          );
                          setStreamOpen(
                            false
                          );
                        }}
                        className={`w-full rounded-lg px-4 py-3 text-left transition ${
                          stream ===
                          "CSE"
                            ? "bg-white text-black"
                            : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >

                        <p className="text-sm font-medium">
                          CSE
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            stream ===
                            "CSE"
                              ? "text-zinc-600"
                              : "text-zinc-500"
                          }`}
                        >
                          
                        </p>

                      </button>


                      <button
                        onClick={() => {
                          selectStream(
                            "ECE"
                          );
                          setStreamOpen(
                            false
                          );
                        }}
                        className={`w-full rounded-lg px-4 py-3 text-left transition ${
                          stream ===
                          "ECE"
                            ? "bg-white text-black"
                            : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >

                        <p className="text-sm font-medium">
                          ECE
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            stream ===
                            "ECE"
                              ? "text-zinc-600"
                              : "text-zinc-500"
                          }`}
                        >
                          Electronics &
                          Communication
                          Engineering
                        </p>

                      </button>

                    </div>

                  )}

                </div>

              </div>

            )}


            {/* SELECTION */}

            {semester &&
              stream && (

                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">

                  <div>

                    <p className="text-xs text-zinc-500">
                      Selected
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {stream} •
                      Semester{" "}
                      {
                        romanNumerals[
                          semester
                        ]
                      }
                    </p>

                  </div>

                  <span className="text-emerald-400">
                    ✓
                  </span>

                </div>

              )}

          </div>

        </section>


        {/* SEMESTER GPA */}

        {semester &&
          stream && (

            <section className="mt-10">

              <div className="grid gap-4 md:grid-cols-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-sm text-zinc-500">
                    Projected Semester GPA
                  </p>

                  <p className="mt-3 text-5xl font-semibold">
                    {semesterGPA.toFixed(
                      2
                    )}
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-sm text-zinc-500">
                    Semester Credits
                  </p>

                  <p className="mt-3 text-5xl font-semibold">
                    {
                      currentSemesterCredits
                    }
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-sm text-zinc-500">
                    Overall GPA
                  </p>

                  <p className="mt-3 text-5xl font-semibold">
                    {overallGPA.toFixed(
                      2
                    )}
                  </p>

                </div>

              </div>


              {/* CURRENT SUBJECTS */}

              <div className="mt-10">

                <h2 className="text-xl font-semibold">
                  {stream} •
                  Semester{" "}
                  {
                    romanNumerals[
                      semester
                    ]
                  }
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  
                </p>


                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">

                  <div className="hidden grid-cols-[1fr_100px_160px] gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-zinc-500 md:grid">

                    <span>
                      Subject
                    </span>

                    <span>
                      Credits
                    </span>

                    <span>
                      Grade
                    </span>

                  </div>


                  {subjects.map(
                    (subject) => (

                      <div
                        key={
                          subject.id
                        }
                        className="grid gap-4 border-b border-white/10 px-6 py-5 last:border-b-0 md:grid-cols-[1fr_100px_160px] md:items-center"
                      >

                        <p className="text-sm">
                          {
                            subject.name
                          }
                        </p>

                        <span className="text-sm text-zinc-400">
                          {
                            subject.credits
                          }
                        </span>

                        <select
                          value={
                            subject.grade
                          }
                          onChange={(
                            e
                          ) =>
                            updateGrade(
                              subject.id,
                              e.target
                                .value
                            )
                          }
                          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm outline-none focus:border-white/30"
                        >

                          {Object.entries(
                            gradePoints
                          ).map(
                            ([
                              grade,
                              points,
                            ]) => (

                              <option
                                key={
                                  grade
                                }
                                value={
                                  grade
                                }
                                className="bg-black"
                              >
                                {
                                  grade
                                }{" "}
                                —{" "}
                                {
                                  points
                                }
                              </option>

                            )
                          )}

                        </select>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* PREVIOUS SEMESTERS */}

              {semester > 1 && (

                <div className="mt-12">

                  <h2 className="text-xl font-semibold">
                    Previous Semester GPAs
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Enter your GPA for
                    previous semesters
                    to calculate your
                    overall GPA.
                  </p>


                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {Array.from(
                      {
                        length:
                          semester -
                          1,
                      },
                      (_, index) => {

                        const sem =
                          index +
                          1;

                        return (

                          <div
                            key={sem}
                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                          >

                            <label className="text-sm text-zinc-400">
                              Semester{" "}
                              {
                                romanNumerals[
                                  sem
                                ]
                              }
                            </label>

                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              placeholder="e.g. 8.50"
                              value={
                                previousGPAs[
                                  sem
                                ] ??
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                updatePreviousGPA(
                                  sem,
                                  e.target
                                    .value
                                )
                              }
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm outline-none focus:border-white/30"
                            />

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

              )}


              {/* GPA GOAL PLANNER */}

              <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div>

                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                    GPA Goal Planner
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Kitni Gpa chahiye?
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                    
                  </p>

                </div>


                <div className="mt-7 grid gap-5 md:grid-cols-2">

                  {/* TARGET */}

                  <div>

                    <label className="text-sm text-zinc-400">
                      Target Overall GPA
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={
                        targetGPA
                      }
                      onChange={(e) =>
                        setTargetGPA(
                          e.target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                    />

                  </div>


                  {/* END SEMESTER */}

                  <div>

                    <label className="text-sm text-zinc-400">
                      Calculate until
                    </label>

                    <select
                      value={
                        goalSemester
                      }
                      onChange={(e) =>
                        setGoalSemester(
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                    >

                      {Array.from(
                        {
                          length: 8,
                        },
                        (_, index) => {

                          const sem =
                            index +
                            1;

                          return (

                            <option
                              key={sem}
                              value={sem}
                              disabled={
                                sem <
                                semester
                              }
                              className="bg-black"
                            >
                              Semester{" "}
                              {
                                romanNumerals[
                                  sem
                                ]
                              }
                            </option>

                          );

                        }
                      )}

                    </select>

                  </div>

                </div>


                {/* RESULT */}

                {goalSemester >
                  semester && (

                    <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-6">

                      {goalPossible ? (

                        <>

                          <p className="text-sm text-zinc-500">
                            Required average
                            GPA from
                            remaining
                            semesters
                          </p>

                          <p className="mt-2 text-5xl font-semibold">
                            {requiredFutureGPA.toFixed(
                              2
                            )}
                          </p>

                          <p className="mt-3 text-sm text-zinc-400">
                            You need an
                            average of{" "}
                            <span className="font-semibold text-white">
                              {requiredFutureGPA.toFixed(
                                2
                              )}
                            </span>{" "}
                            across
                            Sem{" "}
                            {
                              romanNumerals[
                                semester +
                                  1
                              ]
                            }{" "}
                            to{" "}
                            {
                              romanNumerals[
                                goalSemester
                              ]
                            }{" "}
                            to finish
                            with an
                            overall GPA
                            of{" "}
                            <span className="font-semibold text-white">
                              {
                                numericTarget
                              }
                            </span>
                            .
                          </p>

                        </>

                      ) : (

                        <>

                          <p className="text-sm font-medium text-red-400">
                            Cg dosent matter only skills
                          </p>

                          <p className="mt-2 text-sm text-zinc-400">
                            You would need
                            an average
                            GPA of{" "}
                            <span className="font-semibold text-white">
                              {requiredFutureGPA.toFixed(
                                2
                              )}
                            </span>{" "}
                            in the
                            remaining
                            semesters,
                            which is above
                            the 10-point
                            scale.
                          </p>

                        </>

                      )}

                    </div>

                  )}

              </div>

            </section>

          )}

      </div>

    </main>
  );
}
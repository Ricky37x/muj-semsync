"use client";

import { useMemo, useState } from "react";

type ClassStatus = "present" | "absent" | "unmarked";

type CalendarClass = {
  id: string;
  date: string;
  subject: string;
  code: string;
  startTime: string;
  endTime: string;
  room: string;
  status: ClassStatus;
};

const dummyClasses: CalendarClass[] = [
  {
    id: "2026-09-28-1",
    date: "2026-09-28",
    subject: "Data Structures",
    code: "CSE2104",
    startTime: "09:00",
    endTime: "10:00",
    room: "AB2-201",
    status: "present",
  },
  {
    id: "2026-09-28-2",
    date: "2026-09-28",
    subject: "Digital Electronics",
    code: "ECE2105",
    startTime: "11:00",
    endTime: "12:00",
    room: "AB2-103",
    status: "absent",
  },
  {
    id: "2026-09-28-3",
    date: "2026-09-28",
    subject: "Circuits & Systems",
    code: "ECE2107",
    startTime: "14:00",
    endTime: "15:00",
    room: "AB1-204",
    status: "present",
  },

  {
    id: "2026-09-29-1",
    date: "2026-09-29",
    subject: "Probability & Statistics",
    code: "MAS2001",
    startTime: "10:00",
    endTime: "11:00",
    room: "AB3-105",
    status: "present",
  },
  {
    id: "2026-09-29-2",
    date: "2026-09-29",
    subject: "Computer Architecture",
    code: "ECE2108",
    startTime: "12:00",
    endTime: "13:00",
    room: "AB2-301",
    status: "present",
  },
  {
    id: "2026-09-29-3",
    date: "2026-09-29",
    subject: "Data Structures Lab",
    code: "CSE2104L",
    startTime: "15:00",
    endTime: "17:00",
    room: "Lab 4",
    status: "unmarked",
  },

  {
    id: "2026-09-30-1",
    date: "2026-09-30",
    subject: "Engineering Economics",
    code: "HUM2001",
    startTime: "09:00",
    endTime: "10:00",
    room: "AB1-102",
    status: "present",
  },
  {
    id: "2026-09-30-2",
    date: "2026-09-30",
    subject: "Circuits & Systems",
    code: "ECE2107",
    startTime: "11:00",
    endTime: "12:00",
    room: "AB2-103",
    status: "present",
  },
  {
    id: "2026-09-30-3",
    date: "2026-09-30",
    subject: "EDC Lab",
    code: "ECE2106L",
    startTime: "14:00",
    endTime: "16:00",
    room: "Electronics Lab",
    status: "absent",
  },

  {
    id: "2026-10-01-1",
    date: "2026-10-01",
    subject: "Circuits & Systems",
    code: "ECE2107",
    startTime: "10:00",
    endTime: "11:00",
    room: "AB2-103",
    status: "present",
  },
  {
    id: "2026-10-01-2",
    date: "2026-10-01",
    subject: "Data Structures",
    code: "CSE2104",
    startTime: "12:00",
    endTime: "13:00",
    room: "AB2-201",
    status: "unmarked",
  },
  {
    id: "2026-10-01-3",
    date: "2026-10-01",
    subject: "Digital Electronics",
    code: "ECE2105",
    startTime: "15:00",
    endTime: "16:00",
    room: "AB2-103",
    status: "unmarked",
  },

  {
    id: "2026-10-02-1",
    date: "2026-10-02",
    subject: "Computer Architecture",
    code: "ECE2108",
    startTime: "09:00",
    endTime: "10:00",
    room: "AB2-301",
    status: "present",
  },
  {
    id: "2026-10-02-2",
    date: "2026-10-02",
    subject: "Probability & Statistics",
    code: "MAS2001",
    startTime: "11:00",
    endTime: "12:00",
    room: "AB3-105",
    status: "present",
  },
  {
    id: "2026-10-02-3",
    date: "2026-10-02",
    subject: "DSA Lab",
    code: "CSE2104L",
    startTime: "14:00",
    endTime: "16:00",
    room: "Lab 4",
    status: "unmarked",
  },

  {
    id: "2026-10-03-1",
    date: "2026-10-03",
    subject: "Engineering Economics",
    code: "HUM2001",
    startTime: "10:00",
    endTime: "11:00",
    room: "AB1-102",
    status: "unmarked",
  },
  {
    id: "2026-10-03-2",
    date: "2026-10-03",
    subject: "Circuits & Systems",
    code: "ECE2107",
    startTime: "12:00",
    endTime: "13:00",
    room: "AB2-103",
    status: "unmarked",
  },
];

const START_HOUR = 8;
const END_HOUR = 19;
const SLOT_HEIGHT = 64;
const TARGET_ATTENDANCE = 0.75;

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + difference);
  d.setHours(0, 0, 0, 0);

  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function minutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatWeekTitle(start: Date) {
  const end = addDays(start, 6);

  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString("en-US", {
      month: "short",
    })} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
  }

  return `${start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} – ${end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}, ${end.getFullYear()}`;
}

function isToday(date: Date) {
  return dateKey(date) === dateKey(new Date());
}

function getEventStyle(event: CalendarClass) {
  const start = minutesFromTime(event.startTime);
  const end = minutesFromTime(event.endTime);
  const calendarStart = START_HOUR * 60;

  const top = ((start - calendarStart) / 60) * SLOT_HEIGHT;
  const height = ((end - start) / 60) * SLOT_HEIGHT;

  return {
    top: `${top}px`,
    height: `${Math.max(height, 42)}px`,
  };
}

function statusClass(status: ClassStatus) {
  if (status === "present") {
    return "border-emerald-400/40 bg-emerald-500/20 text-emerald-200";
  }

  if (status === "absent") {
    return "border-red-400/40 bg-red-500/20 text-red-200";
  }

  return "border-zinc-600 bg-zinc-800/80 text-zinc-300";
}

function statusDot(status: ClassStatus) {
  if (status === "present") {
    return "bg-emerald-400";
  }

  if (status === "absent") {
    return "bg-red-400";
  }

  return "bg-zinc-500";
}

function getMissableClasses(attended: number, conducted: number) {
  if (conducted === 0) return 0;

  return Math.max(
    0,
    Math.floor(attended / TARGET_ATTENDANCE - conducted)
  );
}

function getClassesNeeded(
  attended: number,
  conducted: number
) {
  if (conducted === 0) return 0;

  const current = attended / conducted;

  if (current >= TARGET_ATTENDANCE) {
    return 0;
  }

  return Math.ceil(
    (TARGET_ATTENDANCE * conducted - attended) /
      (1 - TARGET_ATTENDANCE)
  );
}

export default function TimetablePage() {
  const [weekStart, setWeekStart] = useState(() =>
    getMonday(new Date(2026, 8, 28))
  );

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) =>
      addDays(weekStart, index)
    );
  }, [weekStart]);

  const goPreviousWeek = () => {
    setWeekStart((current) => addDays(current, -7));
  };

  const goNextWeek = () => {
    setWeekStart((current) => addDays(current, 7));
  };

  const goToday = () => {
    setWeekStart(getMonday(new Date()));
  };

  const weekClasses = dummyClasses.filter((event) =>
    weekDays.some((day) => dateKey(day) === event.date)
  );

  /*
    These are only demo attendance values.
    Later these will come directly from SLCM.
  */
  const attended = 9;
  const conducted = 11;

  const currentAttendance =
    conducted > 0 ? attended / conducted : 0;

  const missableClasses = getMissableClasses(
    attended,
    conducted
  );

  const classesNeeded = getClassesNeeded(
    attended,
    conducted
  );

  const handleSync = () => {
    setSyncing(true);
    setSyncMessage("");

    setTimeout(() => {
      setSyncing(false);
      setSyncMessage(
        "Sync unsuccessful. SLCM integration is not available yet."
      );
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 bg-[#09090b]/95">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-6">
          <a
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            <span className="text-zinc-400">37</span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              Attendance
            </a>

            <a
              href="/gpa"
              className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              GPA
            </a>

            <a
              href="/timetable"
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white"
            >
              Timetable
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[1500px] px-6 py-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goPreviousWeek}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              ←
            </button>

            <button
              onClick={goToday}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              Today
            </button>

            <button
              onClick={goNextWeek}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              →
            </button>
          </div>
        </div>

        {/* WEEK TITLE */}
        <div className="mb-4">
          <h2 className="text-xl font-medium text-zinc-100">
            {formatWeekTitle(weekStart)}
          </h2>
        </div>

        {/* CALENDAR */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d0f]">
          {/* DAY HEADERS */}
          <div className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))] border-b border-zinc-800">
            <div className="border-r border-zinc-800" />

            {weekDays.map((day) => (
              <div
                key={dateKey(day)}
                className={`border-r border-zinc-800 px-3 py-4 text-center last:border-r-0 ${
                  isToday(day) ? "bg-zinc-800/40" : ""
                }`}
              >
                <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {day.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>

                <div
                  className={`mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium ${
                    isToday(day)
                      ? "bg-white text-black"
                      : "text-zinc-200"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* TIME GRID */}
          <div className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))] overflow-x-auto">
            {/* TIME COLUMN */}
            <div className="border-r border-zinc-800">
              {Array.from(
                { length: END_HOUR - START_HOUR },
                (_, index) => {
                  const hour = START_HOUR + index;

                  return (
                    <div
                      key={hour}
                      className="relative border-b border-zinc-800"
                      style={{
                        height: `${SLOT_HEIGHT}px`,
                      }}
                    >
                      <span className="absolute -top-2 right-3 text-[11px] text-zinc-600">
                        {hour % 12 || 12}:00{" "}
                        {hour >= 12 ? "PM" : "AM"}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            {/* DAYS */}
            {weekDays.map((day) => {
              const key = dateKey(day);

              const dayEvents = dummyClasses.filter(
                (event) => event.date === key
              );

              return (
                <div
                  key={key}
                  className={`relative border-r border-zinc-800 last:border-r-0 ${
                    isToday(day) ? "bg-zinc-900/60" : ""
                  }`}
                  style={{
                    height: `${
                      (END_HOUR - START_HOUR) * SLOT_HEIGHT
                    }px`,
                  }}
                >
                  {/* HORIZONTAL GRID */}
                  {Array.from(
                    { length: END_HOUR - START_HOUR },
                    (_, index) => (
                      <div
                        key={index}
                        className="absolute left-0 right-0 border-b border-zinc-800"
                        style={{
                          top: `${index * SLOT_HEIGHT}px`,
                        }}
                      />
                    )
                  )}

                  {/* HALF HOUR LINES */}
                  {Array.from(
                    { length: END_HOUR - START_HOUR },
                    (_, index) => (
                      <div
                        key={`half-${index}`}
                        className="absolute left-0 right-0 border-b border-dashed border-zinc-900"
                        style={{
                          top: `${
                            index * SLOT_HEIGHT +
                            SLOT_HEIGHT / 2
                          }px`,
                        }}
                      />
                    )
                  )}

                  {/* EVENTS */}
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`absolute left-1 right-1 z-10 overflow-hidden rounded-lg border p-2 shadow-lg transition hover:z-20 hover:brightness-110 ${statusClass(
                        event.status
                      )}`}
                      style={getEventStyle(event)}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot(
                            event.status
                          )}`}
                        />

                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold">
                            {event.subject}
                          </div>

                          <div className="mt-0.5 truncate text-[10px] opacity-70">
                            {event.code}
                          </div>

                          <div className="mt-1 truncate text-[10px] opacity-70">
                            {formatTime(event.startTime)} –{" "}
                            {formatTime(event.endTime)}
                          </div>

                          <div className="truncate text-[10px] opacity-60">
                            {event.room}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Present
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            Absent
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
            Upcoming / Not marked
          </div>
        </div>

    {/* SUBJECT-WISE ATTENDANCE ADVICE */}
<section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
  <div>
    <h3 className="text-lg font-medium text-zinc-100">
      
    </h3>

    <p className="mt-1 text-sm text-zinc-500">
      
    </p>
  </div>

  <div className="mt-6 grid gap-3">
    {[
      {
        subject: "Data Structures",
        code: "CSE2104",
        attended: 34,
        conducted: 40,
      },
      {
        subject: "Circuits & Systems",
        code: "ECE2107",
        attended: 29,
        conducted: 38,
      },
      {
        subject: "Digital Electronics",
        code: "ECE2105",
        attended: 41,
        conducted: 45,
      },
      {
        subject: "Probability & Statistics",
        code: "MAS2001",
        attended: 27,
        conducted: 36,
      },
      {
        subject: "Engineering Economics",
        code: "HUM2001",
        attended: 27,
        conducted: 36,
      },
      {
        subject: "Computer Architecture",
        code: "ECE2108",
        attended: 27,
        conducted: 36,
      },
      {
        subject: "EDC",
        code: "ECE2106",
        attended: 27,
        conducted: 36,
      },
      {
        subject: "DSA Lab",
        code: "CSE2104L",
        attended: 27,
        conducted: 36,
      },
      {
        subject: "EDC Lab",
        code: "ECE2106L",
        attended: 27,
        conducted: 36,
      },
      {
        subject: "Digital Electronics Lab",
        code: "ECE2105L",
        attended: 27,
        conducted: 36,
      },
    ].map((subject) => {
      const percentage =
        (subject.attended / subject.conducted) * 100;

      // Maximum classes that can be missed while remaining >= 75%
      const canMiss = Math.max(
        0,
        Math.floor(
          subject.attended / 0.75 - subject.conducted
        )
      );

      // Classes that need to be attended consecutively to reach 75%
      const classesNeeded =
        percentage >= 75
          ? 0
          : Math.ceil(
              (0.75 * subject.conducted - subject.attended) /
                0.25
            );

      let status = "Safe";
      let statusColor = "text-emerald-400";

      if (percentage < 75) {
        status = "Critical";
        statusColor = "text-red-400";
      } else if (percentage < 80) {
        status = "Borderline";
        statusColor = "text-amber-400";
      }

      return (
        <div
          key={subject.code}
          className="rounded-xl border border-zinc-800 bg-black/20 px-5 py-4"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* SUBJECT */}
            <div className="min-w-[220px]">
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-zinc-100">
                  {subject.subject}
                </h4>

                <span className="text-xs text-zinc-600">
                  {subject.code}
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-600">
                {subject.attended}/{subject.conducted} classes
              </p>
            </div>

            {/* CURRENT */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                Current
              </p>

              <p className={`mt-1 text-lg font-semibold ${statusColor}`}>
                {percentage.toFixed(1)}%
              </p>
            </div>

            {/* CAN MISS */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                Can miss
              </p>

              <p className="mt-1 text-lg font-semibold text-zinc-100">
                {canMiss}{" "}
                {canMiss === 1 ? "class" : "classes"}
              </p>
            </div>

            {/* NEED TO ATTEND */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                Need to attend
              </p>

              <p className="mt-1 text-lg font-semibold text-zinc-100">
                {classesNeeded}{" "}
                {classesNeeded === 1 ? "class" : "classes"}
              </p>
            </div>

            {/* STATUS */}
            <div className="min-w-[90px] lg:text-right">
              <p className={`text-sm font-medium ${statusColor}`}>
                {status}
              </p>

              <p className="mt-1 text-[10px] text-zinc-600">
                75% target
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

        {/* SLCM SYNC */}
        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-medium text-zinc-100">
                Sync with SLCM
              </h3>

              <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
                Not available yet
              </span>
            </div>

            <p className="text-sm text-zinc-500">
              Enter your SLCM details to sync your timetable and
              attendance.
            </p>
          </div>

          {/* FORM */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-zinc-800 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
              />
            </div>

            {/* USERNAME */}
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">
                SLCM Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your SLCM username"
                className="w-full rounded-lg border border-zinc-800 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">
                SLCM Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your SLCM password"
                className="w-full rounded-lg border border-zinc-800 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
              />
            </div>
          </div>

          {/* SYNC BUTTON */}
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-600">
              
            </p>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "Sync with SLCM"}
            </button>
          </div>

          {/* SYNC MESSAGE */}
          {syncMessage && (
            <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3">
              <p className="text-sm text-red-400">
                {syncMessage}
              </p>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="py-8 text-center text-xs text-zinc-700">
          Sutta please 
          6900917729
        </footer>
      </div>
    </main>
  );
}
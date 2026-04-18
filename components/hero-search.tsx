"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { locationCoords, locationOptions } from "@/lib/locations";

const subjects = ["Math", "English", "IELTS", "Programming", "Physics"];

export function HeroSearch() {
  const router = useRouter();
  const [subject, setSubject] = useState(subjects[0]);
  const [location, setLocation] = useState(locationOptions[0]);

  const coord = useMemo(() => locationCoords[location], [location]);

  return (
    <div className="rounded-3xl bg-white/85 p-4 shadow-xl backdrop-blur sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          className="input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-label="Subject"
        >
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Location"
        >
          {locationOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            router.push(
              `/teachers?subject=${encodeURIComponent(subject)}&location=${encodeURIComponent(location)}&lat=${coord.lat}&lng=${coord.lng}`
            );
          }}
        >
          Axtar
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";

type AbsentEntry = {
    id: number;
    name: string;
    kelas: string;
    time: string; // formatted like '07:30'
    relative: string; // e.g., '2 menit yang lalu'
};

const sampleAbsent: AbsentEntry[] = [
    // mix of times: some before 06:45 (Tepat Waktu), some after (Terlambat)
    { id: 1, name: "Ahmad", kelas: "X-1", time: "06:40", relative: "2 menit yang lalu" },
    { id: 2, name: "Siti", kelas: "X-2", time: "07:31", relative: "5 menit yang lalu" },
    { id: 3, name: "Budi", kelas: "X-3", time: "06:44", relative: "8 menit yang lalu" },
    { id: 4, name: "Dewi", kelas: "X-1", time: "07:33", relative: "12 menit yang lalu" },
    { id: 5, name: "Rian", kelas: "X-4", time: "06:30", relative: "20 menit yang lalu" },
    { id: 6, name: "Maya", kelas: "X-2", time: "07:35", relative: "30 menit yang lalu" },
    { id: 7, name: "Eka", kelas: "X-5", time: "07:36", relative: "35 menit yang lalu" },
    { id: 8, name: "Fajar", kelas: "X-3", time: "07:37", relative: "40 menit yang lalu" },
    { id: 9, name: "Lina", kelas: "X-4", time: "06:20", relative: "50 menit yang lalu" },
    { id: 10, name: "Tono", kelas: "X-5", time: "07:39", relative: "1 jam yang lalu" },
];

export default function AbsentActivityList({ data = sampleAbsent }: { data?: AbsentEntry[] }) {
    // helper: return true if timeStr (HH:MM) is strictly greater than threshold (HH:MM)
    const isAfter = (timeStr: string, threshold: string) => {
        const [h1, m1] = timeStr.split(":").map((s) => parseInt(s, 10));
        const [h2, m2] = threshold.split(":").map((s) => parseInt(s, 10));
        if (h1 !== h2) return h1 > h2;
        return m1 > m2;
    };

    return (
        <div className="space-y-2">
            {data.slice(0, 8).map((d) => {
                const late = isAfter(d.time, "06:45");
                return (
                    <div key={d.id} className="flex items-center px-4 py-3 bg-white rounded-lg card-soft hover:shadow-md transition">
                        <div className="flex-shrink-0 mr-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0B4DA3] to-[#2b6fb3] flex items-center justify-center text-white font-semibold text-lg">
                                {d.name.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div className="truncate pr-4">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {d.name} <span className="text-xs text-gray-400">({d.kelas})</span>
                                        <span className={`ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${late ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {late ? 'Terlambat' : 'Tepat Waktu'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600 truncate">{d.name} sudah absen</p>
                                </div>

                                <div className="text-right ml-4 flex-shrink-0 w-24">
                                    <div className="mt-2 inline-flex items-center px-3 py-1 bg-[#0B4DA3] text-white text-sm font-medium rounded">{d.time}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

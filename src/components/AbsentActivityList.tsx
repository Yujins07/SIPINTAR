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
    { id: 1, name: "Ahmad", kelas: "X-1", time: "07:30", relative: "2 menit yang lalu" },
    { id: 2, name: "Siti", kelas: "X-2", time: "07:31", relative: "5 menit yang lalu" },
    { id: 3, name: "Budi", kelas: "X-3", time: "07:32", relative: "8 menit yang lalu" },
    { id: 4, name: "Dewi", kelas: "X-1", time: "07:33", relative: "12 menit yang lalu" },
    { id: 5, name: "Rian", kelas: "X-4", time: "07:34", relative: "20 menit yang lalu" },
    { id: 6, name: "Maya", kelas: "X-2", time: "07:35", relative: "30 menit yang lalu" },
    { id: 7, name: "Eka", kelas: "X-5", time: "07:36", relative: "35 menit yang lalu" },
    { id: 8, name: "Fajar", kelas: "X-3", time: "07:37", relative: "40 menit yang lalu" },
    { id: 9, name: "Lina", kelas: "X-4", time: "07:38", relative: "50 menit yang lalu" },
    { id: 10, name: "Tono", kelas: "X-5", time: "07:39", relative: "1 jam yang lalu" },
];

export default function AbsentActivityList({ data = sampleAbsent }: { data?: AbsentEntry[] }) {
    return (
        <div className="space-y-3">
            {data.slice(0, 10).map((d) => (
                <div key={d.id} className="flex items-start p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-800 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow">
                            {d.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{d.name} <span className="text-xs text-gray-500">({d.kelas})</span></p>
                                <p className="text-sm text-gray-600">{d.name} sudah absen pada jam <span className="font-medium text-gray-800">{d.time}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">{d.relative}</p>
                                <div className="mt-2 inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">Absen</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

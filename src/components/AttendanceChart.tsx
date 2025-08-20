"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from "recharts";

// Default sample data: 5 classes X-1..X-5 with present students from 1..35
const sampleData = [
    { name: "X-1", present: 28 },
    { name: "X-2", present: 21 },
    { name: "X-3", present: 35 },
    { name: "X-4", present: 17 },
    { name: "X-5", present: 30 },
];

export default function AttendanceChart({ data = sampleData }: { data?: { name: string; present?: number; students?: number }[] }) {
    // Normalize incoming data to { name, present, absent } where absent = 35 - present
    const maxPerClass = 35;
    type InputRow = { name: string; present?: number; students?: number };
    const chartData = (data || sampleData).map((d: InputRow) => {
        const present = typeof d.present === "number" ? d.present : d.students ?? 0;
        const absent = Math.max(0, maxPerClass - present);
        return { name: d.name, present, absent };
    });
    // Ensure the Y axis max is 35 (fixed). If incoming data exceeds 35 the bar will
    // render up to the top value; consider capping or normalizing incoming data
    // before passing if you want to show proportions instead.
    return (
        <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, maxPerClass]} ticks={[0, 5, 10, 15, 20, 25, 30, 35]} />
                    <Tooltip formatter={(value: number | string, name?: string | number) => [value, String(name ?? '')]} />
                    <Legend />
                    {/* Present (dark blue) */}
                    <Bar dataKey="present" name="Hadir" fill="#0B4DA3" radius={[6, 6, 0, 0]}>
                        <LabelList dataKey="present" position="top" formatter={(val: React.ReactNode) => String(val)} />
                    </Bar>
                    {/* Absent (gray) */}
                    <Bar dataKey="absent" name="Tidak Hadir" fill="#9CA3AF" radius={[6, 6, 0, 0]}>
                        <LabelList dataKey="absent" position="top" formatter={(val: React.ReactNode) => String(val)} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

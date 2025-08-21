"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function AttendancePie({ present = 0, absent = 0, late = 0, size = 96 }: { present?: number; absent?: number; late?: number; size?: number }) {
    const data = [
        { name: "Hadir", value: present },
        { name: "Absen", value: absent },
        { name: "Terlambat", value: late },
    ];

    const COLORS = ["#0B4DA3", "#EF4444", "#F59E0B"];
    const total = present + absent + late;
    // make canvas slightly larger than requested size to avoid clipping labels/edges
    const canvasSize = Math.round(size * 1.1);
    const height = Math.max(64, Math.round(canvasSize));
    const innerRadius = Math.max(16, Math.round(size * 0.3));
    const outerRadius = Math.max(24, Math.round(size * 0.5));

    if (total === 0) {
        return (
            <div style={{ width: size, height }} className="mx-auto flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-1" style={{ width: Math.round(size * 0.35), height: Math.round(size * 0.35), borderRadius: '50%', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: Math.round(size * 0.18), height: Math.round(size * 0.18), borderRadius: '50%', background: '#f3f4f6' }} />
                    </div>
                    <div className="text-xs text-gray-500">Belum ada data</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: canvasSize, height, overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties} className="mx-auto">
            <PieChart width={canvasSize} height={height}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={2}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}`} />
            </PieChart>
        </div>
    );
}

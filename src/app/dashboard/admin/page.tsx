"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AttendanceChart from "@/components/AttendanceChart";
import AbsentActivityList from "@/components/AbsentActivityList";
import AttendancePie from "@/components/AttendancePie";
import { Users, UserCheck, Layers } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

type AttendanceSummary = {
    present?: number;
    absent?: number;
    late?: number;
};

interface Stats {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSubjects: number;
    studentsByGender: {
        male: number;
        female: number;
        other?: number;
    };
    classByGrade: Record<string, number>;
    classBySection: Record<string, number>;
    attendanceSummary?: AttendanceSummary;
}

export default function AdminDashboard() {
    const [user] = useState<User | null>(null);
    const [stats] = useState<Stats>({
        // Dummy data for demo: 131 hadir, 44 absen
        totalStudents: 175,
        totalTeachers: 18,
        totalClasses: 5,
        totalSubjects: 18,
        studentsByGender: {
            male: 0,
            female: 0,
            other: 0,
        },
        classByGrade: {} as Record<string, number>,
        classBySection: {} as Record<string, number>,
        attendanceSummary: { present: 131, absent: 44, late: 0 },
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Simple logout handler: redirect to the login page.
    // Replace with real logout logic (API call, token clear) as needed.
    const handleLogout = () => {
        if (typeof window !== "undefined") {
            // clear any client-side auth state here if necessary
            window.location.href = "/auth/login";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                onCloseMobile={() => setSidebarOpen(false)}
                onToggle={() => setSidebarOpen((s) => !s)}
            />

            {/* Header */}
            <header className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 py-6 flex items-center justify-between lg:pl-20">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold">Dashboard Administrator</h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Mobile hamburger to open sidebar */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md mr-2 bg-gray-100"
                        aria-label="Open sidebar"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* desktop has hover-expand sidebar; no permanent toggle */}
                    <div className="text-right">
                        <p className="text-xs text-gray-500">{user?.role ?? "Administrator - Azis"}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Hero background panel behind the top cards */}
            <div className="relative">
                <div className="absolute inset-x-0 top-0 h-96 md:h-[28rem] lg:h-[32rem] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-4xl -z-10" />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 lg:pl-24">
                    {/* Top: four summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                        {/* Total Students */}
                        <div className="rounded-lg bg-white shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 p-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-[#0B4DA3] flex items-center justify-center text-white">
                                    <Users size={20} />
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-[#0B4DA3] leading-tight">{stats.totalStudents}</p>
                                <p className="text-base text-gray-600">Total Siswa</p>
                            </div>
                        </div>

                        {/* Total Teachers */}
                        <div className="rounded-lg bg-white shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 p-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-[#0B4DA3] flex items-center justify-center text-white">
                                    <UserCheck size={20} />
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-[#0B4DA3] leading-tight">{stats.totalTeachers}</p>
                                <p className="text-base text-gray-600">Total Guru</p>
                            </div>
                        </div>

                        {/* Total Classes */}
                        <div className="rounded-lg bg-white shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 p-4 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-[#0B4DA3] flex items-center justify-center text-white">
                                    <Layers size={20} />
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-[#0B4DA3] leading-tight">{stats.totalClasses}</p>
                                <p className="text-base text-gray-600">Total Kelas</p>
                            </div>
                        </div>

                        {/* Attendance Summary */}
                        <div className="rounded-lg bg-white shadow-sm p-4 flex items-center space-x-4 justify-between overflow-visible">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <AttendancePie
                                        present={stats.attendanceSummary?.present ?? 0}
                                        absent={stats.attendanceSummary?.absent ?? 0}
                                        late={stats.attendanceSummary?.late ?? 0}
                                        size={100}
                                    />
                                </div>

                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#0B4DA3' }} />
                                        <div>
                                            <div className="text-lg font-semibold">{stats.attendanceSummary?.present ?? 0}</div>
                                            <div className="text-xs text-gray-500">Hadir</div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center space-x-3">
                                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
                                        <div>
                                            <div className="text-lg font-semibold">{stats.attendanceSummary?.absent ?? 0}</div>
                                            <div className="text-xs text-gray-500">Tidak Hadir</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: graph and recent activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Kehadiran Siswa</h3>
                            <div className="w-full overflow-hidden rounded min-h-[240px]">
                                <AttendanceChart />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-md font-medium text-gray-900 mb-3">Absensi Siswa</h3>
                            {/* compact view: show only 5 recent absences */}
                            <div className="space-y-2">
                                {/* reuse AbsentActivityList but show a compact version by passing data and custom styles is more involved; for now slice via CSS wrapper */}
                                <div className="space-y-2 max-h-96 overflow-y-auto pr-4 pb-4">
                                    <AbsentActivityList />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Removed full-width recent activity to save space as requested */}
                </main>
            </div>
        </div>
    );
}

// Small presentational component for activity rows
// ...existing code...

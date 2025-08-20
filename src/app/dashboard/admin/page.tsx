"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AttendanceChart from "@/components/AttendanceChart";
import AbsentActivityList from "@/components/AbsentActivityList";

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
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalSubjects: 0,
        studentsByGender: {
            male: 0,
            female: 0,
            other: 0,
        },
        classByGrade: {} as Record<string, number>,
        classBySection: {} as Record<string, number>,
        attendanceSummary: {},
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
        <div className="min-h-screen bg-white text-gray-800">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                onCloseMobile={() => setSidebarOpen(false)}
                onToggle={() => setSidebarOpen((s) => !s)}
            />

            {/* Header */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard Administrator</h1>
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
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user?.name ?? "Admin"}</p>
                        <p className="text-xs text-gray-500">{user?.role ?? "Administrator"}</p>
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
                <div className="absolute inset-x-0 top-0 h-64 md:h-72 lg:h-80 bg-gray-100 rounded-b-3xl -z-10" />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
                    {/* Top: four summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Card component - consistent structure */}
                        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-lg bg-cyan-500 flex items-center justify-center shadow-md">
                                    <i className="pi pi-users text-white text-2xl"></i>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.totalStudents}</p>
                                <p className="text-sm text-gray-500">Total Siswa</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                                    <i className="pi pi-id-card text-white text-2xl"></i>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.totalTeachers}</p>
                                <p className="text-sm text-gray-500">Total Guru</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-lg bg-amber-500 flex items-center justify-center shadow-md">
                                    <i className="pi pi-book text-white text-2xl"></i>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.totalSubjects}</p>
                                <p className="text-sm text-gray-500">Mata Pelajaran</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <p className="text-sm text-gray-500">Statistik Kehadiran</p>
                            <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-gray-700">
                                <div className="bg-gray-50 rounded-md p-3 text-center">
                                    <div className="text-xs text-gray-500">Hadir</div>
                                    <div className="font-semibold text-lg">{stats.attendanceSummary?.present ?? 0}</div>
                                </div>
                                <div className="bg-gray-50 rounded-md p-3 text-center">
                                    <div className="text-xs text-gray-500">Absen</div>
                                    <div className="font-semibold text-lg">{stats.attendanceSummary?.absent ?? 0}</div>
                                </div>
                                <div className="bg-gray-50 rounded-md p-3 text-center">
                                    <div className="text-xs text-gray-500">Terlambat</div>
                                    <div className="font-semibold text-lg">{stats.attendanceSummary?.late ?? 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: graph and recent activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Kehadiran per Kelas</h3>
                            <div className="w-full overflow-hidden rounded">
                                <AttendanceChart />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-4">
                            <h3 className="text-md font-medium text-gray-900 mb-3">Aktivitas Absen</h3>
                            {/* compact view: show only 5 recent absences */}
                            <div className="space-y-2">
                                {/* reuse AbsentActivityList but show a compact version by passing data and custom styles is more involved; for now slice via CSS wrapper */}
                                <div className="space-y-2 max-h-60 overflow-y-auto">
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

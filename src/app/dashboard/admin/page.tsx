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

<<<<<<< HEAD
            {/* Header */}
            <header className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 py-6 flex items-center justify-between lg:pl-20">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold">Dashboard Administrator</h1>
=======

                        {/* Navigation */}
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            <Link
                                href="/dashboard/admin"
                                className="bg-blue-800 bg-opacity-50 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Dashboard"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Dashboard
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/students"
                                className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Siswa"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Siswa
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/teachers"
                                className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Guru"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Guru
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/classes"
                                className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Kelas"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Kelas
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/subjects"
                                className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Mata Pelajaran"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Mata Pelajaran
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/admin/attendance"
                                className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Absensi"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Absensi
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/grades"
                                className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Nilai"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Nilai
                                </span>
                            </Link>

                            <Link
                                href="/dashboard/reports"
                                className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                title="Laporan"
                            >
                                <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className={`ml-3 transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                    Laporan
                                </span>
                            </Link>
                        </nav>
                    </div>
>>>>>>> absensi
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

<<<<<<< HEAD
                    {/* desktop has hover-expand sidebar; no permanent toggle */}
                    <div className="text-right">
                        <p className="text-xs text-gray-500">{user?.role ?? "Administrator - Azis"}</p>
=======
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Guru</h1>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
>>>>>>> absensi
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

<<<<<<< HEAD
            {/* Hero background panel behind the top cards */}
            <div className="relative">
                <div className="absolute inset-x-0 top-0 h-96 md:h-[28rem] lg:h-[32rem] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-4xl -z-10" />
=======
                {/* Main content area */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {/* Welcome Section */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Selamat Datang, Rini Wulandari
                                    {/* {user.name} */}
                                    !
                                </h2>
                                <p className="text-gray-600">Kelola sistem sekolah dengan mudah dan efisien</p>
                            </div>
>>>>>>> absensi

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

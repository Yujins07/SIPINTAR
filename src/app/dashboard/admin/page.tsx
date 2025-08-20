'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface User {
    id: string
    name: string
    email: string
    role: string
}

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalSubjects: 0,
        studentsByGender: {
            male: 0,
            female: 0,
            other: 0
        },
        classByGrade: {} as Record<string, number>,
        classBySection: {} as Record<string, number>,
    })
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarHovered, setSidebarHovered] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            router.push('/auth/login')
            return
        }

        const parsedUser = JSON.parse(userData)
        if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'TEACHER') {
            router.push('/auth/login')
            return
        }

        setUser(parsedUser)
        fetchStats()
    }, [router])

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/')
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Hover Sidebar */}
            <div
                className="hidden lg:flex lg:flex-shrink-0 group"
                onMouseEnter={() => setSidebarHovered(true)}
                onMouseLeave={() => setSidebarHovered(false)}
            >
                <div className={`flex flex-col transition-all duration-300 ease-in-out ${sidebarHovered ? 'w-64' : 'w-16'}`}>
                    <div className="flex flex-col h-0 flex-1 shadow-lg" style={{ backgroundColor: '#0D1320' }}>
                        {/* Logo */}
                        <div className="flex items-center h-16 flex-shrink-0 px-4" style={{ backgroundColor: '#0D1320' }}>
                            <Image
                                src="/Logo Geometris dengan Topi Wisuda.png"
                                alt="SIPINTAR Logo"
                                width={32}
                                height={32}
                                className={`transition-all duration-300 ${sidebarHovered ? 'mr-3' : 'mx-auto'}`}
                            />
                            <h1 className={`text-xl font-bold text-white transition-all duration-300 ${sidebarHovered ? 'opacity-100' : 'opacity-0 w-0'} overflow-hidden`}>
                                SIPINTAR
                            </h1>
                        </div>


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
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className={`lg:hidden fixed inset-0 flex z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full" style={{ backgroundColor: '#0D1320' }}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile navigation - same as desktop */}
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 py-4" style={{ backgroundColor: '#0D1320' }}>
                            <Image
                                src="/Logo Geometris dengan Topi Wisuda.png"
                                alt="SIPINTAR Logo"
                                width={32}
                                height={32}
                                className="mr-3"
                            />
                            <h1 className="text-xl font-bold text-white">
                                SIPINTAR
                            </h1>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {/* Same navigation items as desktop */}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top header */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

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
                    </div>
                </div>

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

                            {/* Stats Cards and Gender Statistics */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Gender Statistics Circle Chart */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Total Murid</h3>
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-48 h-48 mb-4">
                                            {/* SVG Circle Chart */}
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                                                {/* Background circle */}
                                                <circle
                                                    cx="100"
                                                    cy="100"
                                                    r="80"
                                                    fill="none"
                                                    stroke="#f3f4f6"
                                                    strokeWidth="20"
                                                />

                                                {/* Male segment */}
                                                {stats.studentsByGender.male > 0 && (
                                                    <circle
                                                        cx="100"
                                                        cy="100"
                                                        r="80"
                                                        fill="none"
                                                        stroke="#3b82f6"
                                                        strokeWidth="20"
                                                        strokeDasharray={`${(stats.studentsByGender.male / stats.totalStudents) * 502.65} 502.65`}
                                                        strokeDashoffset="0"
                                                        strokeLinecap="round"
                                                    />
                                                )}

                                                {/* Female segment */}
                                                {stats.studentsByGender.female > 0 && (
                                                    <circle
                                                        cx="100"
                                                        cy="100"
                                                        r="80"
                                                        fill="none"
                                                        stroke="#ec4899"
                                                        strokeWidth="20"
                                                        strokeDasharray={`${(stats.studentsByGender.female / stats.totalStudents) * 502.65} 502.65`}
                                                        strokeDashoffset={`-${(stats.studentsByGender.male / stats.totalStudents) * 502.65}`}
                                                        strokeLinecap="round"
                                                    />
                                                )}

                                                {/* Center number */}
                                                <text x="100" y="108" textAnchor="middle" style={{ fill: '#111827', fontSize: '28px', fontWeight: '700', fontStyle: 'normal' }} transform="rotate(90 100 100)">
                                                    {stats.totalStudents}
                                                </text>
                                            </svg>
                                        </div>

                                        {/* Legend */}
                                        <div className="space-y-2 w-full">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                                    <span className="text-sm text-gray-700">Laki-laki</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-gray-900">{stats.studentsByGender.male}</span>
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({stats.totalStudents > 0 ? Math.round((stats.studentsByGender.male / stats.totalStudents) * 100) : 0}%)
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                                                    <span className="text-sm text-gray-700">Perempuan</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-gray-900">{stats.studentsByGender.female}</span>
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({stats.totalStudents > 0 ? Math.round((stats.studentsByGender.female / stats.totalStudents) * 100) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="lg:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-lg shadow">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Total Siswa</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Total Guru</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Total Kelas</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Total Mata Pelajaran</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow p-6 mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link
                                        href="/dashboard/students"
                                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Kelola Siswa</p>
                                            <p className="text-sm text-gray-500">Tambah, edit, atau lihat data siswa</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/dashboard/teachers"
                                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Kelola Guru</p>
                                            <p className="text-sm text-gray-500">Tambah, edit, atau lihat data guru</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/dashboard/classes"
                                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Kelola Kelas</p>
                                            <p className="text-sm text-gray-500">Atur kelas dan mata pelajaran</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Class Distribution Bar Chart */}
                            <div className="bg-white rounded-lg shadow p-6 mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Distribusi Kelas</h3>
                                
                                <div className="space-y-6">
                                    {/* Stacked Bar Chart by Grade with Sections */}
                                    <div>
                                        <h4 className="text-md font-medium text-gray-700 mb-4">Distribusi Kelas Berdasarkan Tingkat dan Jurusan</h4>
                                        
                                        {/* Legend */}
                                        <div className="flex flex-wrap gap-4 mb-6">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                                <span className="text-sm text-gray-700">IPA</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                                                <span className="text-sm text-gray-700">IPS</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                                                <span className="text-sm text-gray-700">BAHASA</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                                                <span className="text-sm text-gray-700">Lainnya</span>
                                            </div>
                                        </div>

                                        {/* Stacked Bars */}
                                        <div className="space-y-4">
                                            {(() => {
                                                // Group classes by grade and section
                                                const gradeData: Record<string, Record<string, number>> = {}
                                                
                                                // Initialize grade data structure
                                                Object.entries(stats.classByGrade).forEach(([grade]) => {
                                                    gradeData[grade] = { IPA: 0, IPS: 0, BAHASA: 0, OTHER: 0 }
                                                })

                                                // This would ideally come from a more detailed API
                                                // For now, we'll simulate the distribution
                                                Object.entries(stats.classByGrade).forEach(([grade, total]) => {
                                                    if (!gradeData[grade]) gradeData[grade] = { IPA: 0, IPS: 0, BAHASA: 0, OTHER: 0 }
                                                    
                                                    // Simulate distribution (this would come from real data)
                                                    const ipaCount = Math.floor(total * 0.4)
                                                    const ipsCount = Math.floor(total * 0.35)
                                                    const bahasaCount = Math.floor(total * 0.15)
                                                    const otherCount = total - ipaCount - ipsCount - bahasaCount
                                                    
                                                    gradeData[grade] = {
                                                        IPA: ipaCount,
                                                        IPS: ipsCount,
                                                        BAHASA: bahasaCount,
                                                        OTHER: Math.max(0, otherCount)
                                                    }
                                                })

                                                const maxTotal = Math.max(...Object.entries(gradeData).map(([, sections]) =>
                                                    Object.values(sections).reduce((sum, count) => sum + count, 0)
                                                ))

                                                return Object.entries(gradeData).map(([grade, sections]) => {
                                                    const total = Object.values(sections).reduce((sum, count) => sum + count, 0)
                                                    const totalPercentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0
                                                    
                                                    return (
                                                        <div key={grade} className="flex items-center">
                                                            {/* Grade Label */}
                                                            <div className="w-20 text-sm font-medium text-gray-700 text-right mr-4">
                                                                Kelas {grade}
                                                            </div>
                                                            
                                                            {/* Stacked Bar Container */}
                                                            <div className="flex-1 relative">
                                                                <div 
                                                                    className="flex h-8 bg-gray-100 rounded overflow-hidden"
                                                                    style={{ width: `${Math.max(totalPercentage, 20)}%` }}
                                                                >
                                                                    {/* IPA Segment */}
                                                                    {sections.IPA > 0 && (
                                                                        <div 
                                                                            className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                                                                            style={{ width: `${(sections.IPA / total) * 100}%` }}
                                                                        >
                                                                            {sections.IPA > 0 && total > 5 && sections.IPA}
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {/* IPS Segment */}
                                                                    {sections.IPS > 0 && (
                                                                        <div 
                                                                            className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                                                                            style={{ width: `${(sections.IPS / total) * 100}%` }}
                                                                        >
                                                                            {sections.IPS > 0 && total > 5 && sections.IPS}
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {/* BAHASA Segment */}
                                                                    {sections.BAHASA > 0 && (
                                                                        <div 
                                                                            className="bg-orange-500 flex items-center justify-center text-white text-xs font-medium"
                                                                            style={{ width: `${(sections.BAHASA / total) * 100}%` }}
                                                                        >
                                                                            {sections.BAHASA > 0 && total > 3 && sections.BAHASA}
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {/* OTHER Segment */}
                                                                    {sections.OTHER > 0 && (
                                                                        <div 
                                                                            className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                                                                            style={{ width: `${(sections.OTHER / total) * 100}%` }}
                                                                        >
                                                                            {sections.OTHER > 0 && total > 3 && sections.OTHER}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Total Count */}
                                                            <div className="w-12 text-right text-sm text-gray-600 ml-4">
                                                                {total}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            })()}
                                        </div>
                                        
                                        {Object.keys(stats.classByGrade).length === 0 && (
                                            <div className="text-center py-8">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <p className="mt-2 text-gray-500 text-sm">Belum ada data kelas untuk ditampilkan</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Aktivitas Terbaru</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Siswa baru ditambahkan</p>
                                            <p className="text-xs text-gray-500">2 jam yang lalu</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Laporan absensi bulan ini</p>
                                            <p className="text-xs text-gray-500">5 jam yang lalu</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Nilai ujian diperbarui</p>
                                            <p className="text-xs text-gray-500">1 hari yang lalu</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

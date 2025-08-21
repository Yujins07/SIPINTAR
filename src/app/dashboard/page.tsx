'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface User {
    id: string
    email: string
    name: string
    role: string
    profileImage?: string
    studentId?: string
    teacherId?: string
}

interface DashboardStats {
    totalStudents: number
    totalTeachers: number
    totalClasses: number
    totalSubjects: number
}

interface ChartData {
    enrollmentData: { name: string; students: number }[]
    attendanceData: { month: string; present: number; absent: number; late: number }[]
    gradeData: { grade: string; count: number }[]
    subjectData: { name: string; teachers: number }[]
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/login')
            return
        }

        // Parse JWT to get user info (in production, verify with server)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser(payload)
            fetchDashboardData()
        } catch (error) {
            console.error('Invalid token:', error)
            localStorage.removeItem('token')
            router.push('/auth/login')
        }
    }, [router])

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token')

            // Fetch stats
            const statsResponse = await fetch('/api/dashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (statsResponse.ok) {
                const statsData = await statsResponse.json()
                setStats(statsData)
            }

            // Fetch chart data
            const chartsResponse = await fetch('/api/dashboard/charts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (chartsResponse.ok) {
                const chartsData = await chartsResponse.json()
                setChartData(chartsData)
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/auth/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
            <Sidebar
                sidebarOpen={sidebarOpen}
                onCloseMobile={() => setSidebarOpen(false)}
                onToggle={() => setSidebarOpen((s) => !s)}
            />
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md mr-2 bg-gray-100"
                                aria-label="Open sidebar"
                            >
                                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">SIPINTAR</h1>
                            <span className="ml-2 text-sm text-gray-500">Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Selamat datang, <strong>{user?.name}</strong> ({user?.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Selamat datang, {user?.name}!
                    </h2>
                    <p className="text-gray-600">
                        {user?.role === 'ADMIN' && 'Kelola sistem sekolah dari dashboard admin.'}
                        {user?.role === 'TEACHER' && 'Kelola kelas, siswa, dan nilai dari dashboard guru.'}
                        {user?.role === 'STUDENT' && 'Lihat jadwal, nilai, dan absensi Anda.'}
                    </p>
                </div>

                {/* Stats Cards */}
                {user?.role === 'ADMIN' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Siswa</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Guru</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalTeachers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Kelas</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalClasses}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Mata Pelajaran</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalSubjects}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                {user?.role === 'ADMIN' && chartData && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Analytics Dashboard</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Student Enrollment by Class */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Jumlah Siswa per Kelas</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData.enrollmentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="students" fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Grade Distribution */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Nilai</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.gradeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {chartData.gradeData.map((entry, index) => {
                                                const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280']
                                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                            })}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Attendance Trend */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tren Kehadiran (6 Bulan Terakhir)</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData.attendanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="present" stroke="#10B981" name="Hadir" />
                                        <Line type="monotone" dataKey="absent" stroke="#EF4444" name="Tidak Hadir" />
                                        <Line type="monotone" dataKey="late" stroke="#F59E0B" name="Terlambat" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Teachers per Subject */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Guru per Mata Pelajaran</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData.subjectData} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="name" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="teachers" fill="#8B5CF6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user?.role === 'ADMIN' && (
                        <>
                            <Link href="/dashboard/students" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Kelola Siswa</h3>
                                        <p className="text-sm text-gray-600">Tambah, edit, dan kelola data siswa</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/dashboard/teachers" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Kelola Guru</h3>
                                        <p className="text-sm text-gray-600">Tambah, edit, dan kelola data guru</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/dashboard/classes" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Kelola Kelas</h3>
                                        <p className="text-sm text-gray-600">Atur kelas dan mata pelajaran</p>
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}

                    {user?.role === 'TEACHER' && (
                        <>
                            <Link href="/dashboard/my-classes" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Kelas Saya</h3>
                                        <p className="text-sm text-gray-600">Lihat dan kelola kelas yang Anda ajar</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/dashboard/attendance" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-yellow-100">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Absensi</h3>
                                        <p className="text-sm text-gray-600">Input dan kelola absensi siswa</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/dashboard/grades" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Nilai</h3>
                                        <p className="text-sm text-gray-600">Input dan kelola nilai siswa</p>
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}

                    {user?.role === 'STUDENT' && (
                        <>
                            <Link href="/dashboard/my-grades" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Nilai Saya</h3>
                                        <p className="text-sm text-gray-600">Lihat nilai dan progress akademik</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/dashboard/my-attendance" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-yellow-100">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Absensi Saya</h3>
                                        <p className="text-sm text-gray-600">Lihat riwayat kehadiran</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/dashboard/schedule" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Jadwal</h3>
                                        <p className="text-sm text-gray-600">Lihat jadwal pelajaran</p>
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

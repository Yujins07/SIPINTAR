'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface Child {
    id: string
    name: string
    studentNumber: string
    class: string
    attendance: number
    lastGrade: string
}

export default function ParentDashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [children] = useState<Child[]>([
        {
            id: '1',
            name: 'Ahmad Pratama',
            studentNumber: 'SW001',
            class: 'X IPA 1',
            attendance: 95,
            lastGrade: 'A'
        }
    ])
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            router.push('/auth/login')
            return
        }

        const parsedUser = JSON.parse(userData)
        if (parsedUser.role !== 'PARENT') {
            router.push('/auth/login')
            return
        }

        setUser(parsedUser)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/')
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/Logo Geometris dengan Topi Wisuda.png"
                                alt="SIPINTAR Logo"
                                width={32}
                                height={32}
                            />
                            <h1 className="text-xl font-bold text-blue-700">SIPINTAR</h1>
                            <span className="text-gray-500">|</span>
                            <span className="text-gray-600">Dashboard Orang Tua</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">Orang Tua</p>
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
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Selamat Datang, {user.name}!
                    </h2>
                    <p className="text-gray-600">Monitor perkembangan akademik anak Anda</p>
                </div>

                {/* Children Cards */}
                <div className="grid gap-6 mb-8">
                    {children.map((child) => (
                        <div key={child.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{child.name}</h3>
                                    <p className="text-gray-600">NIS: {child.studentNumber} | Kelas: {child.class}</p>
                                </div>
                                <div className="text-right">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-700">Kehadiran</p>
                                            <p className="text-xl font-bold text-green-900">{child.attendance}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">Nilai Terakhir</p>
                                            <p className="text-xl font-bold text-blue-900">{child.lastGrade}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-purple-700">Mata Pelajaran</p>
                                            <p className="text-xl font-bold text-purple-900">12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions for this child */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button className="flex items-center justify-center p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-blue-700">Lihat Nilai</span>
                                </button>

                                <button className="flex items-center justify-center p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-green-700">Absensi</span>
                                </button>

                                <button className="flex items-center justify-center p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m0 0v3m0-3h6m-6 0H6" />
                                    </svg>
                                    <span className="text-sm font-medium text-purple-700">Jadwal</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Updates */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pemberitahuan Terbaru</h3>
                    <div className="space-y-4">
                        <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">Nilai Ujian Matematika</p>
                                <p className="text-xs text-blue-700 mt-1">Ahmad Pratama mendapat nilai A untuk ujian matematika</p>
                                <p className="text-xs text-blue-600 mt-1">2 jam yang lalu</p>
                            </div>
                        </div>

                        <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900">Kehadiran Sempurna</p>
                                <p className="text-xs text-green-700 mt-1">Ahmad Pratama hadir tepat waktu hari ini</p>
                                <p className="text-xs text-green-600 mt-1">5 jam yang lalu</p>
                            </div>
                        </div>

                        <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-900">Pengumuman Sekolah</p>
                                <p className="text-xs text-yellow-700 mt-1">Rapat orang tua akan dilaksanakan minggu depan</p>
                                <p className="text-xs text-yellow-600 mt-1">1 hari yang lalu</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact School */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Hubungi Sekolah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Telepon</p>
                                <p className="text-sm text-gray-600">+62 21 1234-5678</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-600">info@sipintar.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

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
  attendanceData: {
    month: string
    present: number
    absent: number
    late: number
  }[]
  gradeData: { grade: string; count: number }[]
  subjectData: { name: string; teachers: number }[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
          Authorization: `Bearer ${token}`,
        },
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch chart data
      const chartsResponse = await fetch('/api/dashboard/charts', {
        headers: {
          Authorization: `Bearer ${token}`,
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
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  // Statistik kehadiran Jarwo untuk dashboard admin
  const jarwoAttendanceWeek = [
    { day: 'Senin', hadir: true },
    { day: 'Selasa', hadir: false },
    { day: 'Rabu', hadir: true },
    { day: 'Kamis', hadir: false },
    { day: 'Jumat', hadir: true },
  ]
  const jarwoHadirCount = jarwoAttendanceWeek.filter((a) => a.hadir).length

  if (user?.role === 'ADMIN' && stats) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <nav className='bg-white shadow-sm border-b'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex items-center'>
                <h1 className='text-xl font-bold text-gray-900'>SIPINTAR</h1>
                <span className='ml-2 text-sm text-gray-500'>
                  Dashboard Admin
                </span>
              </div>
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-gray-700'>
                  Selamat datang, <strong>{user?.name}</strong> ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-blue-100'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Siswa
                  </p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    {stats.totalStudents}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-green-100'>
                  <svg
                    className='w-6 h-6 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Guru
                  </p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    {stats.totalTeachers}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-purple-100'>
                  <svg
                    className='w-6 h-6 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Kelas
                  </p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    {stats.totalClasses}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-yellow-100'>
                  <svg
                    className='w-6 h-6 text-yellow-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-500'>
                    Mata Pelajaran
                  </p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    {stats.totalSubjects}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Statistik Kehadiran Jarwo */}
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2'>
              <svg
                className='w-7 h-7 text-blue-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                />
              </svg>
              Statistik Kehadiran Siswa:{' '}
              <span className='text-blue-900'>Jarwo</span>
            </h3>
            <div className='bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg border border-blue-100 p-8 mb-6'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <p className='text-lg font-semibold text-gray-900'>
                    Kehadiran Minggu Ini
                  </p>
                  <p className='text-sm text-gray-500'>
                    Periode: <span className='font-medium'>Senin - Jumat</span>
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center gap-1'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    {jarwoHadirCount} Hadir
                  </span>
                  <span className='px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-sm flex items-center gap-1'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                    {5 - jarwoHadirCount} Tidak Hadir
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                {jarwoAttendanceWeek.map((a, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center py-3 rounded-lg border ${
                      a.hadir
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <span className='text-gray-700 font-medium mb-1'>
                      {a.day}
                    </span>
                    <span
                      className={
                        a.hadir
                          ? 'text-green-600 font-bold'
                          : 'text-red-500 font-bold'
                      }
                    >
                      {a.hadir ? (
                        <span className='flex items-center gap-1'>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          Hadir
                        </span>
                      ) : (
                        <span className='flex items-center gap-1'>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                          Tidak Hadir
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className='mt-4'>
                <p className='text-sm text-gray-600 mb-2'>
                  Progress Kehadiran Mingguan
                </p>
                <div className='w-full h-5 bg-gray-200 rounded-full overflow-hidden'>
                  <div
                    className='h-5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500'
                    style={{ width: `${(jarwoHadirCount / 7) * 100}%` }}
                  ></div>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  {jarwoHadirCount} dari 7 hari hadir
                </p>
              </div>
            </div>
            <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-8'>
              <h4 className='text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
                Grafik Kehadiran Mingguan
              </h4>
              <ResponsiveContainer width='100%' height={180}>
                <BarChart
                  data={jarwoAttendanceWeek.map((a) => ({
                    day: a.day,
                    hadir: a.hadir ? 1 : 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='day' />
                  <YAxis allowDecimals={false} domain={[0, 1]} />
                  <Tooltip
                    formatter={(value) =>
                      value === 1 ? 'Hadir' : 'Tidak Hadir'
                    }
                  />
                  <Bar dataKey='hadir' fill='#38bdf8' radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Custom dashboard for student named Jarwo
  if (user?.role === 'STUDENT' && user?.name?.toLowerCase() === 'jarwo') {
    // Simulated attendance data for Jarwo
    const attendanceWeek = [
      { day: 'Senin', hadir: true },
      { day: 'Selasa', hadir: false },
      { day: 'Rabu', hadir: true },
      { day: 'Kamis', hadir: false },
      { day: 'Jumat', hadir: true },
    ]
    const hadirCount = attendanceWeek.filter((a) => a.hadir).length
    return (
      <div className='min-h-screen bg-gray-50'>
        <nav className='bg-white shadow-sm border-b'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex items-center'>
                <h1 className='text-xl font-bold text-gray-900'>SIPINTAR</h1>
                <span className='ml-2 text-sm text-gray-500'>
                  Dashboard Siswa
                </span>
              </div>
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-gray-700'>
                  Selamat datang, <strong>{user?.name}</strong> ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Statistik Kehadiran Mingguan
            </h2>
            <p className='text-gray-600 mb-2'>
              Siswa: <strong>Jarwo</strong>
            </p>
            <div className='bg-white rounded-lg shadow-sm border p-6 mb-6'>
              <p className='text-lg font-semibold text-gray-900 mb-2'>
                Kehadiran Minggu Ini
              </p>
              <div className='flex flex-col gap-2'>
                {attendanceWeek.map((a, idx) => (
                  <div key={idx} className='flex justify-between items-center'>
                    <span className='text-gray-700'>{a.day}</span>
                    <span
                      className={
                        a.hadir
                          ? 'text-green-600 font-bold'
                          : 'text-red-500 font-bold'
                      }
                    >
                      {a.hadir ? 'Hadir' : 'Tidak Hadir'}
                    </span>
                  </div>
                ))}
              </div>
              <div className='mt-4'>
                <p className='text-sm text-gray-600'>
                  Total hadir:{' '}
                  <span className='font-bold text-green-600'>{hadirCount}</span>{' '}
                  dari 7 hari
                </p>
                <div className='w-full h-4 bg-gray-200 rounded-full mt-2'>
                  <div
                    className='h-4 bg-green-500 rounded-full'
                    style={{ width: `${(hadirCount / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Grafik Kehadiran
              </h3>
              <ResponsiveContainer width='100%' height={220}>
                <BarChart
                  data={attendanceWeek.map((a) => ({
                    day: a.day,
                    hadir: a.hadir ? 1 : 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='day' />
                  <YAxis allowDecimals={false} domain={[0, 1]} />
                  <Tooltip
                    formatter={(value) =>
                      value === 1 ? 'Hadir' : 'Tidak Hadir'
                    }
                  />
                  <Bar dataKey='hadir' fill='#10B981' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // ...existing code...
}

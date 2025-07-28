import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">SIPINTAR</h1>
                            <span className="ml-2 text-sm text-gray-500">Sistem Informasi Pintar Sekolah</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/auth/login"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Selamat Datang di <span className="text-blue-600">SIPINTAR</span>
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                        Sistem Informasi Pintar untuk manajemen sekolah yang komprehensif.
                        Kelola siswa, guru, kelas, absensi, dan nilai dengan mudah dan efisien.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/auth/login"
                            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Mulai Sekarang
                        </Link>
                        <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                            Pelajari lebih lanjut <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="mt-20">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900">Fitur Unggulan</h3>
                        <p className="mt-4 text-lg text-gray-600">
                            Kelola seluruh aspek sekolah dengan satu platform terintegrasi
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Manajemen Siswa</h4>
                            <p className="mt-2 text-gray-600">Kelola data siswa, enrollment kelas, dan informasi orang tua dengan mudah.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Manajemen Kelas</h4>
                            <p className="mt-2 text-gray-600">Atur kelas, mata pelajaran, dan jadwal dengan sistem yang terintegrasi.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Sistem Penilaian</h4>
                            <p className="mt-2 text-gray-600">Input nilai, generate laporan, dan tracking progress akademik siswa.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Absensi Digital</h4>
                            <p className="mt-2 text-gray-600">Sistem absensi digital dengan laporan kehadiran realtime.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Manajemen Guru</h4>
                            <p className="mt-2 text-gray-600">Kelola data guru, assignment mata pelajaran, dan kualifikasi.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Dashboard Admin</h4>
                            <p className="mt-2 text-gray-600">Dashboard lengkap dengan analytics dan monitoring sistem sekolah.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">SIPINTAR</h3>
                        <p className="mt-2 text-gray-400">Sistem Informasi Pintar Sekolah</p>
                        <p className="mt-4 text-sm text-gray-500">
                            © 2025 SIPINTAR. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="absolute top-0 w-full z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="/Logo Geometris dengan Topi Wisuda.png"
                            alt="SIPINTAR Logo"
                            width={40}
                            height={40}
                            className="drop-shadow-md"
                        />
                        <span className="text-2xl font-bold text-blue-700">SIPINTAR</span>
                    </div>

                    <div className="flex items-center space-x-8">
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">Fitur</a>
                            <a href="#about" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">Tentang</a>
                            <a href="#contact" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">Kontak</a>
                        </div>
                        <Link
                            href="/auth/login"
                            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors shadow-lg"
                        >
                            Masuk
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="mb-8 flex justify-center">
                            <Image
                                src="/Logo Geometris dengan Topi Wisuda.png"
                                alt="SIPINTAR Logo"
                                width={120}
                                height={120}
                                className="drop-shadow-2xl"
                            />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
                            <span className="text-blue-700">SI</span>PINTAR
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
                            Sistem Pemantauan Interaktif dan Pintar
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/auth/login"
                                className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Mulai Sekarang
                            </Link>
                            <Link
                                href="#features"
                                className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 hover:text-white transition-all transform hover:scale-105"
                            >
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Fitur Unggulan</h2>
                        <p className="text-xl text-gray-600">Solusi lengkap untuk kebutuhan manajemen sekolah Anda</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
                            <div className="w-16 h-16 bg-blue-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Manajemen Siswa</h3>
                            <p className="text-gray-600">Kelola data siswa, absensi, dan nilai dengan mudah dan terorganisir</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center p-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Analytics</h3>
                            <p className="text-gray-600">Analisis dan laporan real-time untuk memantau perkembangan sekolah</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
                            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Keamanan Data</h3>
                            <p className="text-gray-600">Sistem keamanan tingkat tinggi untuk melindungi data sekolah Anda</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">Tentang SIPINTAR</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                SIPINTAR (Sistem Pemantauan Interaktif dan Pintar) adalah solusi digital terdepan untuk manajemen sekolah modern.
                                Dirancang khusus untuk membantu institusi pendidikan dalam mengelola data siswa, guru, dan
                                administrasi sekolah dengan lebih efisien.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Interface yang user-friendly</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Laporan otomatis dan real-time</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Akses multi-platform</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="relative">
                                <Image
                                    src="/Logo Geometris dengan Topi Wisuda.png"
                                    alt="SIPINTAR Logo Large"
                                    width={300}
                                    height={300}
                                    className="drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-700">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Siap Memulai?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Bergabunglah dengan sekolah-sekolah yang telah merasakan kemudahan manajemen dengan SIPINTAR</p>
                    <Link
                        href="/auth/login"
                        className="inline-block bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
                    >
                        Coba Sekarang Gratis
                    </Link>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Hubungi Kami</h2>
                        <p className="text-xl text-gray-600">Tim kami siap membantu Anda memulai digitalisasi sekolah</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
                            <div className="w-16 h-16 bg-blue-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Email</h3>
                            <p className="text-gray-600">info@sipintar.com</p>
                            <p className="text-gray-600">support@sipintar.com</p>
                        </div>

                        <div className="text-center p-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Telepon</h3>
                            <p className="text-gray-600">+62 21 1234-5678</p>
                            <p className="text-gray-600">+62 812 3456-7890</p>
                        </div>

                        <div className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
                            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Alamat</h3>
                            <p className="text-gray-600">Jl. Pendidikan No. 123</p>
                            <p className="text-gray-600">Jakarta Selatan 12345</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <Image
                                src="/Logo Geometris dengan Topi Wisuda.png"
                                alt="SIPINTAR Logo"
                                width={32}
                                height={32}
                            />
                            <span className="text-xl font-bold text-white">SIPINTAR</span>
                        </div>
                        <div className="text-gray-400 text-center md:text-right">
                            <p>&copy; 2025 SIPINTAR. Semua hak dilindungi.</p>
                            <p className="mt-2 text-sm">Sistem Informasi Pintar untuk Sekolah Modern</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

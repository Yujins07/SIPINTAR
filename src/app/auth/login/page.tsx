'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                // Store token or handle authentication
                localStorage.setItem('token', data.token)
                router.push('/dashboard')
            } else {
                const data = await response.json()
                setError(data.message || 'Login failed')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">SIPINTAR</h2>
                        <p className="mt-2 text-sm text-gray-600">Sistem Informasi Pintar Sekolah</p>
                        <h3 className="mt-6 text-xl font-semibold text-gray-900">Masuk ke Akun Anda</h3>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan email Anda"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan password Anda"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Lupa password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Masuk...' : 'Masuk'}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                                    Daftar di sini
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Accounts:</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Admin:</strong> admin@sipintar.com / admin123</p>
                            <p><strong>Guru:</strong> guru@sipintar.com / guru123</p>
                            <p><strong>Siswa:</strong> siswa@sipintar.com / siswa123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

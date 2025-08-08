'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Class {
    id: string
    name: string
    grade: string
    section: string
    maxStudents: number
    room: string
    teacher: {
        user: {
            name: string
        }
        teacherNumber: string
    }
    subject: {
        name: string
        code: string
    }
    _count: {
        students: number
    }
}

interface Teacher {
    id: string
    user: {
        name: string
    }
    teacherNumber: string
}

interface Subject {
    id: string
    name: string
    code: string
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        section: '',
        maxStudents: '',
        room: '',
        teacherId: '',
        subjectId: '',
    })
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/login')
            return
        }

        fetchData()
    }, [router])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token')

            // Fetch classes, teachers, and subjects
            const [classesRes, teachersRes, subjectsRes] = await Promise.all([
                fetch('/api/classes', {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch('/api/teachers', {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch('/api/subjects', {
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            ])

            if (classesRes.ok) {
                const data = await classesRes.json()
                setClasses(data)
            }

            if (teachersRes.ok) {
                const data = await teachersRes.json()
                setTeachers(data)
            }

            if (subjectsRes.ok) {
                const data = await subjectsRes.json()
                setSubjects(data)
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    maxStudents: parseInt(formData.maxStudents) || 30
                }),
            })

            if (response.ok) {
                // Reset form and close modal
                setFormData({
                    name: '',
                    grade: '',
                    section: '',
                    maxStudents: '',
                    room: '',
                    teacherId: '',
                    subjectId: '',
                })
                setShowAddForm(false)

                // Refresh classes list
                await fetchData()

                alert('Kelas berhasil ditambahkan!')
            } else {
                const error = await response.json()
                alert(error.message || 'Gagal menambahkan kelas')
            }
        } catch (error) {
            console.error('Error adding class:', error)
            alert('Terjadi kesalahan saat menambahkan kelas')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">SIPINTAR</h1>
                            <span className="ml-2 text-sm text-gray-500">Manajemen Kelas</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/dashboard/admin')}
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                ← Kembali ke Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h2>
                        <p className="text-gray-600">Kelola kelas dan mata pelajaran</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        + Tambah Kelas
                    </button>
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.length === 0 ? (
                        <div className="col-span-full">
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada kelas</h3>
                                <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan kelas baru.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        + Tambah Kelas Pertama
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        classes.map((classItem) => (
                            <div key={classItem.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {classItem.name}
                                        </h3>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="font-medium">Tingkat:</span>
                                                <span className="ml-2">{classItem.grade} - {classItem.section}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium">Ruang:</span>
                                                <span className="ml-2">{classItem.room}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium">Wali Kelas:</span>
                                                <span className="ml-2">{classItem.teacher.user.name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium">Mata Pelajaran:</span>
                                                <span className="ml-2">{classItem.subject.name} ({classItem.subject.code})</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium">Siswa:</span>
                                                <span className="ml-2">
                                                    {classItem._count.students} / {classItem.maxStudents}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classItem._count.students >= classItem.maxStudents
                                                ? 'bg-red-100 text-red-800'
                                                : classItem._count.students >= classItem.maxStudents * 0.8
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                            {classItem._count.students >= classItem.maxStudents
                                                ? 'Penuh'
                                                : classItem._count.students >= classItem.maxStudents * 0.8
                                                    ? 'Hampir Penuh'
                                                    : 'Tersedia'
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 flex space-x-3">
                                    <button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Class Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Tambah Kelas Baru</h3>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama Kelas *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Contoh: X-IPA-1"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tingkat/Grade *
                                            </label>
                                            <select
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Pilih Tingkat</option>
                                                <option value="X">X (Sepuluh)</option>
                                                <option value="XI">XI (Sebelas)</option>
                                                <option value="XII">XII (Dua Belas)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Jurusan *
                                            </label>
                                            <select
                                                name="section"
                                                value={formData.section}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Pilih Jurusan</option>
                                                <option value="IPA">IPA</option>
                                                <option value="IPS">IPS</option>
                                                <option value="BAHASA">BAHASA</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ruang Kelas *
                                            </label>
                                            <input
                                                type="text"
                                                name="room"
                                                value={formData.room}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Contoh: R101"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Maksimal Siswa *
                                            </label>
                                            <input
                                                type="number"
                                                name="maxStudents"
                                                value={formData.maxStudents}
                                                onChange={handleInputChange}
                                                required
                                                min="1"
                                                max="50"
                                                placeholder="30"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Wali Kelas *
                                            </label>
                                            <select
                                                name="teacherId"
                                                value={formData.teacherId}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Pilih Wali Kelas</option>
                                                {teachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.user.name} ({teacher.teacherNumber})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mata Pelajaran *
                                            </label>
                                            <select
                                                name="subjectId"
                                                value={formData.subjectId}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Pilih Mata Pelajaran</option>
                                                {subjects.map((subject) => (
                                                    <option key={subject.id} value={subject.id}>
                                                        {subject.name} ({subject.code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-6 border-t">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                            disabled={isSubmitting}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Menyimpan...' : 'Simpan Kelas'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

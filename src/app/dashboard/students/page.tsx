'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Student {
    id: string
    user: {
        name: string
        email: string
    }
    studentNumber: string
    dateOfBirth: string
    address: string
    phone?: string
    parentName: string
    parentPhone: string
    kelas?: string
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [query, setQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 10
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // sample class cards (X-1 .. X-5)
    const classCards = [
        { id: 'X-1', name: 'X-1', students: 32 },
        { id: 'X-2', name: 'X-2', students: 28 },
        { id: 'X-3', name: 'X-3', students: 30 },
        { id: 'X-4', name: 'X-4', students: 27 },
        { id: 'X-5', name: 'X-5', students: 31 },
    ]

    // generate 35 sample students assigned to X-1 (default class)
    const sampleStudents: Student[] = useMemo(() => {
        const arr: Student[] = []
        for (let i = 0; i < 35; i++) {
            const idx = i + 1
            const kelas = `X-1`
            arr.push({
                id: `${idx}`,
                user: { name: `Siswa ${idx}`, email: `siswa${idx}@example.com` },
                studentNumber: `${1000 + idx}`,
                dateOfBirth: `2008-01-${String((i % 28) + 1).padStart(2, '0')}`,
                address: `Alamat contoh ${idx}`,
                phone: `08${(100000000 + idx).toString().slice(-9)}`,
                parentName: `Ortu ${idx}`,
                parentPhone: `08${(900000000 + idx).toString().slice(-9)}`,
                kelas,
            })
        }
        return arr
    }, [])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        studentNumber: '',
        dateOfBirth: '',
        address: '',
        phone: '',
        parentName: '',
        parentPhone: '',
        emergencyContact: '',
    })
    const router = useRouter()
    const [kelasFilter, setKelasFilter] = useState<string | null>('X-1')
    // edit / delete states
    const [editingStudent, setEditingStudent] = useState<Student | null>(null)
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        studentNumber: '',
        dateOfBirth: '',
        address: '',
        phone: '',
        parentName: '',
        parentPhone: '',
    })
    const [showEditForm, setShowEditForm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)

    const fetchStudents = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/students', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                // if API returns empty, fall back to generated sample data
                if (!data || (Array.isArray(data) && data.length === 0)) {
                    setStudents(sampleStudents)
                } else {
                    setStudents(data)
                }
            }
        } catch (error) {
            console.error('Failed to fetch students:', error)
            // fallback to generated sample students on error
            setStudents(sampleStudents)
        } finally {
            setIsLoading(false)
        }
    }, [sampleStudents])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            // For demo: if there's no token, show generated sample students for class X-1
            setStudents(sampleStudents)
            setIsLoading(false)
            return
        }
        fetchStudents()
    }, [router, fetchStudents, sampleStudents])

    // small client-side search + pagination
    const filteredStudents = useMemo(() => {
        let list = students
        if (kelasFilter) {
            list = list.filter((s) => s.kelas === kelasFilter)
        }
        const q = query.trim().toLowerCase()
        if (!q) return list
        return list.filter(s =>
            s.user.name.toLowerCase().includes(q) ||
            s.studentNumber.toLowerCase().includes(q) ||
            s.user.email.toLowerCase().includes(q)
        )
    }, [students, query, kelasFilter])

    const total = filteredStudents.length
    const startIndex = (currentPage - 1) * perPage
    const paginated = filteredStudents.slice(startIndex, startIndex + perPage)

    // Duplicate fetchStudents removed; use the useCallback version above.

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                // Reset form and close modal
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    studentNumber: '',
                    dateOfBirth: '',
                    address: '',
                    phone: '',
                    parentName: '',
                    parentPhone: '',
                    emergencyContact: '',
                })
                setShowAddForm(false)

                // Refresh students list
                await fetchStudents()

                alert('Siswa berhasil ditambahkan!')
            } else {
                const error = await response.json()
                alert(error.message || 'Gagal menambahkan siswa')
            }
        } catch (error) {
            console.error('Error adding student:', error)
            alert('Terjadi kesalahan saat menambahkan siswa')
        } finally {
            setIsSubmitting(false)
        }
    }

    // open edit modal and populate form
    const openEdit = (s: Student) => {
        setEditingStudent(s)
        setEditFormData({
            name: s.user.name,
            email: s.user.email,
            studentNumber: s.studentNumber,
            dateOfBirth: s.dateOfBirth,
            address: s.address,
            phone: s.phone || '',
            parentName: s.parentName,
            parentPhone: s.parentPhone,
        })
        setShowEditForm(true)
    }

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingStudent) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/students?id=${encodeURIComponent(editingStudent.id)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editFormData),
            })
            if (res.ok) {
                await fetchStudents()
                setShowEditForm(false)
                setEditingStudent(null)
                alert('Perubahan siswa berhasil disimpan')
            } else {
                const err = await res.json()
                alert(err?.message || 'Gagal menyimpan perubahan')
            }
        } catch (err) {
            console.error(err)
            alert('Terjadi kesalahan saat menyimpan perubahan')
        }
    }

    const confirmDelete = (s: Student) => {
        setDeleteTarget(s)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/students?id=${encodeURIComponent(deleteTarget.id)}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            })
            if (res.ok) {
                await fetchStudents()
                setDeleteTarget(null)
                alert('Siswa berhasil dihapus')
            } else {
                const err = await res.json()
                alert(err?.message || 'Gagal menghapus siswa')
            }
        } catch (err) {
            console.error(err)
            alert('Terjadi kesalahan saat menghapus siswa')
        } finally {
            setIsDeleting(false)
        }
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
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                onCloseMobile={() => setSidebarOpen(false)}
                onToggle={() => setSidebarOpen((s) => !s)}
            />
            {/* Header (match admin style) */}
            <header className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 py-6 flex items-center justify-between lg:pl-20">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold">Manajemen Siswa</h1>
                    <p className="text-sm text-gray-600">Kelola data dan informasi siswa</p>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md mr-2 bg-gray-100"
                        aria-label="Open sidebar"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/admin')}
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        ← Kembali ke Dashboard
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pl-24">
                {/* Class Cards */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                        {classCards.map((c) => (
                            <button key={c.id} onClick={() => setKelasFilter(prev => prev === c.id ? null : c.id)} className={`text-left rounded-lg bg-white shadow-sm transition-transform transform hover:-translate-y-1 p-4 flex items-center space-x-3 ${kelasFilter === c.id ? 'ring-2 ring-[#0B4DA3]' : ''}`}>
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0B4DA3] to-[#2b6fb3] flex items-center justify-center text-white">
                                        <Users size={18} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xl font-extrabold text-[#0B4DA3]">{c.name}</p>
                                    <p className="text-sm text-gray-500">{c.students} siswa</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => setKelasFilter(null)} className="px-3 py-2 rounded-md border border-gray-200 text-sm">Clear</button>
                    </div>
                </div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Siswa
                        </button>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl shadow p-0 overflow-hidden">

                    <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900">Daftar Siswa</h3>
                            <p className="text-sm text-gray-500">Total: {students.length} siswa</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari nama, email, atau NIS..."
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setCurrentPage(1) }}
                                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                                </svg>
                            </div>
                            <button className="px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50">Export</button>
                        </div>
                    </div>

                    {students.length === 0 ? (
                        <div className="px-6 py-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada siswa</h3>
                            <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan siswa baru.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    + Tambah Siswa Pertama
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Siswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            NIS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kontak
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orang Tua
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginated.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0B4DA3] to-[#2b6fb3] text-white flex items-center justify-center font-medium">{student.user.name.charAt(0).toUpperCase()}</div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">{student.user.name}</div>
                                                        <div className="text-sm text-gray-500 truncate">{student.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.studentNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{student.phone || 'Tidak ada'}</div>
                                                <div className="text-xs">{student.address}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{student.parentName}</div>
                                                <div className="text-xs">{student.parentPhone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                                                <button onClick={() => openEdit(student)} className="flex items-center gap-2 text-sm text-[#0B4DA3] hover:text-[#083a86] px-2 py-1 rounded-md border border-transparent hover:bg-gray-50">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11l-6-6-6 6z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button onClick={() => confirmDelete(student)} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-900 px-2 py-1 rounded-md border border-red-50">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* pagination */}
                            <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
                                <div className="text-sm text-gray-600">Menampilkan {Math.min(startIndex + 1, total)}–{Math.min(startIndex + paginated.length, total)} dari {total}</div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
                                    <div className="text-sm">{currentPage}</div>
                                    <button onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50" disabled={startIndex + perPage >= total}>Next</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Student Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Tambah Siswa Baru</h3>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Data Siswa */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Data Siswa</h4>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nama Lengkap *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nomor Induk Siswa (NIS) *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="studentNumber"
                                                    value={formData.studentNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tanggal Lahir *
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    No. Telefon Siswa
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Data Orang Tua */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Data Orang Tua</h4>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nama Orang Tua/Wali *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="parentName"
                                                    value={formData.parentName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    No. Telefon Orang Tua *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="parentPhone"
                                                    value={formData.parentPhone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Kontak Darurat
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="emergencyContact"
                                                    value={formData.emergencyContact}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Alamat *
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
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
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Menyimpan...' : 'Simpan Siswa'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Edit Student Modal */}
            {showEditForm && editingStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Siswa</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input name="name" value={editFormData.name} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input name="email" value={editFormData.email} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                                    <input name="studentNumber" value={editFormData.studentNumber} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                    <input type="date" name="dateOfBirth" value={editFormData.dateOfBirth} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telefon</label>
                                    <input name="phone" value={editFormData.phone} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua</label>
                                    <input name="parentName" value={editFormData.parentName} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => { setShowEditForm(false); setEditingStudent(null) }} className="px-4 py-2 bg-gray-100 rounded-md">Batal</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-medium text-gray-900">Hapus Siswa</h3>
                        <p className="text-sm text-gray-600 mt-2">Apakah Anda yakin ingin menghapus <strong>{deleteTarget.user.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="mt-4 flex justify-end gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-gray-100 rounded-md">Batal</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-md">{isDeleting ? 'Menghapus...' : 'Hapus'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'

type UserLite = { id: string; name: string; email: string; isActive: boolean }

type Student = {
	id: string
	studentNumber: string
	user: UserLite
}

type Klass = { id: string; name: string }

type AttendanceRecord = {
	id: string
	studentId: string
	classId: string
	teacherId: string | null
	status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
	date: string
}

const STATUS_OPTIONS: AttendanceRecord['status'][] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']

function getToken() {
	if (typeof window === 'undefined') return ''
	return localStorage.getItem('token') || ''
}

export default function AdminAttendancePage() {
	const [students, setStudents] = useState<Student[]>([])
	const [classes, setClasses] = useState<Klass[]>([])
	const [selectedClassId, setSelectedClassId] = useState<string>('')
	const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')

	// Load students and classes once
	useEffect(() => {
		const load = async () => {
			try {
				const [resStudents, resClasses] = await Promise.all([
					fetch('/api/students', { headers: { Authorization: `Bearer ${getToken()}` } }),
					fetch('/api/classes', { headers: { Authorization: `Bearer ${getToken()}` } }),
				])
				if (!resStudents.ok) throw new Error('Gagal memuat data siswa')
				if (!resClasses.ok) throw new Error('Gagal memuat data kelas')
				const dataStudents = await resStudents.json()
				const dataClasses = await resClasses.json()
				const flat: Student[] = dataStudents.map((s: any) => ({ id: s.id, studentNumber: s.studentNumber, user: s.user }))
				setStudents(flat)
				setClasses(dataClasses.map((c: any) => ({ id: c.id, name: c.name })))
				setSelectedClassId(dataClasses[0]?.id || '')
			} catch (e: any) {
				setError(e.message || 'Terjadi kesalahan')
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	// Poll attendance every 3s
	useEffect(() => {
		let timer: any
		const poll = async () => {
			try {
				const url = selectedClassId ? `/api/attendance?classId=${selectedClassId}` : '/api/attendance'
				const res = await fetch(url)
				if (!res.ok) return
				const data = await res.json()
				const map: Record<string, AttendanceRecord> = {}
				for (const r of data.records as AttendanceRecord[]) {
					map[r.studentId] = r
				}
				setAttendanceMap((prev) => {
					const next = { ...prev }
					for (const sid of Object.keys(map)) {
						const before = prev[sid]
						const now = map[sid]
						if (!before || (before.status !== 'PRESENT' && now.status === 'PRESENT')) {
							triggerSparkle(sid)
						}
						next[sid] = now
					}
					return next
				})
			} catch {}
			finally {
				timer = setTimeout(poll, 3000)
			}
		}
		poll()
		return () => clearTimeout(timer)
	}, [selectedClassId])

	const markManual = async (studentId: string, status: AttendanceRecord['status']) => {
		try {
			const classId = attendanceMap[studentId]?.classId || selectedClassId || undefined
			const res = await fetch('/api/attendance/manual', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ studentId, classId, status }),
			})
			if (!res.ok) throw new Error('Gagal mengubah status')
			const data = await res.json()
			setAttendanceMap((prev) => ({ ...prev, [studentId]: data.record }))
			if (status === 'PRESENT') triggerSparkle(studentId)
		} catch (e: any) {
			setError(e.message || 'Terjadi kesalahan')
		}
	}

	return (
		<div className="p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Absensi Siswa</h1>
						<p className="text-sm text-slate-500 mt-1">Prototype realtime attendance dengan deteksi wajah atau input manual.</p>
					</div>
					<Link href="/dashboard/admin" className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800 transition-colors">Kembali</Link>
				</div>

				<div className="mb-5 flex items-center gap-3">
					<label className="text-sm text-slate-600">Kelas aktif:</label>
					<div className="relative">
						<select
							className="appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
							value={selectedClassId}
							onChange={(e) => setSelectedClassId(e.target.value)}
						>
							{classes.map((c) => (
								<option key={c.id} value={c.id}>{c.name}</option>
							))}
						</select>
						<div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
							<svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z" clipRule="evenodd"/></svg>
						</div>
					</div>
				</div>

				{error && (
					<div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm shadow-sm">{error}</div>
				)}

				{loading ? (
					<div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Memuat...</div>
				) : (
					<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
						<table className="min-w-full divide-y divide-slate-100">
							<thead className="bg-slate-50/60">
								<tr>
									<th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider text-slate-500">No. Siswa</th>
									<th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider text-slate-500">Nama</th>
									<th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider text-slate-500">Email</th>
									<th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider text-slate-500">Status</th>
									<th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider text-slate-500">Ubah</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 bg-white">
								{students.map((s) => {
									const record = attendanceMap[s.id]
									const status = record?.status || 'ABSENT'
									return (
										<tr id={`row-${s.id}`} key={s.id} className="hover:bg-slate-50">
											<td className="px-4 py-3 text-sm text-slate-900">{s.studentNumber}</td>
											<td className="px-4 py-3 text-sm text-slate-900">
												<div className="flex items-center gap-2">
													<div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
														{getInitials(s.user.name)}
													</div>
													<span>{s.user.name}</span>
													<span id={`sparkle-${s.id}`} className={`ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : status === 'LATE' ? 'bg-amber-100 text-amber-700' : status === 'EXCUSED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
														{status}
													</span>
												</div>
											</td>
											<td className="px-4 py-3 text-sm text-slate-500">{s.user.email}</td>
											<td className="px-4 py-3 text-sm">
												<span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : status === 'LATE' ? 'bg-amber-100 text-amber-700' : status === 'EXCUSED' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>{status}</span>
											</td>
											<td className="px-4 py-3 text-sm">
												<div className="relative inline-block">
													<select
														className="appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
														value={status}
														onChange={(e) => markManual(s.id, e.target.value as AttendanceRecord['status'])}
													>
														{STATUS_OPTIONS.map((opt) => (
															<option key={opt} value={opt}>
																{opt}
															</option>
														))}
													</select>
													<div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
														<svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z" clipRule="evenodd"/></svg>
													</div>
												</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

function triggerSparkle(studentId: string) {
	const el = document.getElementById(`sparkle-${studentId}`)
	if (!el) return
	el.classList.add('animate-pulse')
	setTimeout(() => {
		el.classList.remove('animate-pulse')
		const row = document.getElementById(`row-${studentId}`)
		if (row) {
			row.classList.add('ring-2', 'ring-emerald-300/60')
			setTimeout(() => row.classList.remove('ring-2', 'ring-emerald-300/60'), 600)
		}
	}, 800)
}

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/)
	const first = parts[0]?.[0] ?? ''
	const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
	return (first + last).toUpperCase()
} 
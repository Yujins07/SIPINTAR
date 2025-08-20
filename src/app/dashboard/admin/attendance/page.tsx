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
				const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } })
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
					Authorization: `Bearer ${getToken()}`,
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
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Absensi Siswa (Prototype)</h1>
				<Link href="/dashboard/admin" className="text-sm text-blue-600 hover:underline">Kembali ke Dashboard</Link>
			</div>

			<div className="flex items-center gap-3 mb-4">
				<label className="text-sm text-gray-600">Kelas aktif untuk penandaan:</label>
				<select
					className="rounded border border-gray-300 px-2 py-1 text-sm"
					value={selectedClassId}
					onChange={(e) => setSelectedClassId(e.target.value)}
				>
					{classes.map((c) => (
						<option key={c.id} value={c.id}>{c.name}</option>
					))}
				</select>
			</div>

			{error && (
				<div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>
			)}

			{loading ? (
				<div>Memuat...</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-gray-200">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Siswa</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubah</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{students.map((s) => {
								const record = attendanceMap[s.id]
								const status = record?.status || 'ABSENT'
								return (
									<tr key={s.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-900">{s.studentNumber}</td>
										<td className="px-4 py-3 text-sm text-gray-900 flex items-center gap-2">
											<span>{s.user.name}</span>
											<span id={`sparkle-${s.id}`} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-all ${status === 'PRESENT' ? 'bg-green-100 text-green-800 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
												{status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">{s.user.email}</td>
										<td className="px-4 py-3 text-sm">
											<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === 'PRESENT' ? 'bg-green-100 text-green-800' : status === 'LATE' ? 'bg-yellow-100 text-yellow-800' : status === 'EXCUSED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>{status}</span>
										</td>
										<td className="px-4 py-3 text-sm">
											<select
												className="rounded border border-gray-300 px-2 py-1 text-sm"
												value={status}
												onChange={(e) => markManual(s.id, e.target.value as AttendanceRecord['status'])}
											>
												{STATUS_OPTIONS.map((opt) => (
													<option key={opt} value={opt}>
														{opt}
													</option>
												))}
											</select>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

function triggerSparkle(studentId: string) {
	const el = document.getElementById(`sparkle-${studentId}`)
	if (!el) return
	el.classList.remove('animate-pulse')
	void el.offsetWidth
	el.classList.add('animate-pulse')
} 
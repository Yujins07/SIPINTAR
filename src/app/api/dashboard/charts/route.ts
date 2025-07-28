import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.NEXTAUTH_SECRET || 'sipintar-secret-key-2025-change-in-production')

        // Sample data untuk demo - nanti bisa diganti dengan data real dari database
        const enrollmentData = [
            { name: 'Kelas X-1', students: 32 },
            { name: 'Kelas X-2', students: 30 },
            { name: 'Kelas XI-1', students: 28 },
            { name: 'Kelas XI-2', students: 29 },
            { name: 'Kelas XII-1', students: 25 },
            { name: 'Kelas XII-2', students: 27 }
        ]

        const attendanceData = [
            { month: 'Jan 2025', present: 850, absent: 45, late: 23 },
            { month: 'Feb 2025', present: 823, absent: 52, late: 31 },
            { month: 'Mar 2025', present: 867, absent: 38, late: 19 },
            { month: 'Apr 2025', present: 834, absent: 47, late: 25 },
            { month: 'May 2025', present: 856, absent: 41, late: 22 },
            { month: 'Jun 2025', present: 878, absent: 35, late: 18 }
        ]

        const gradeData = [
            { grade: 'A', count: 45 },
            { grade: 'B', count: 78 },
            { grade: 'C', count: 123 },
            { grade: 'D', count: 34 },
            { grade: 'E', count: 12 }
        ]

        const subjectData = [
            { name: 'Matematika', teachers: 4 },
            { name: 'Bahasa Indonesia', teachers: 3 },
            { name: 'Bahasa Inggris', teachers: 3 },
            { name: 'Fisika', teachers: 2 },
            { name: 'Kimia', teachers: 2 },
            { name: 'Biologi', teachers: 2 },
            { name: 'Sejarah', teachers: 2 },
            { name: 'Geografi', teachers: 1 }
        ]

        return NextResponse.json({
            enrollmentData,
            attendanceData,
            gradeData,
            subjectData
        })

    } catch (error) {
        console.error('Charts API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
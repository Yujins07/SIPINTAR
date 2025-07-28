import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { message: 'No token provided' },
                { status: 401 }
            )
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as {
            userId: string
            role: string
            email: string
            name: string
        }

        if (decoded.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Access denied. Admin role required.' },
                { status: 403 }
            )
        }

        // Get dashboard statistics
        const [totalStudents, totalTeachers, totalClasses, totalSubjects] = await Promise.all([
            prisma.student.count({ where: { user: { isActive: true } } }),
            prisma.teacher.count({ where: { user: { isActive: true } } }),
            prisma.class.count({ where: { isActive: true } }),
            prisma.subject.count({ where: { isActive: true } }),
        ])

        return NextResponse.json({
            totalStudents,
            totalTeachers,
            totalClasses,
            totalSubjects,
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getDayRange(date?: string) {
    const base = date ? new Date(date) : new Date()
    const start = new Date(base)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 1)
    return { start, end }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date') || undefined
        const classId = searchParams.get('classId') || undefined
        const { start, end } = getDayRange(dateParam)

        const records = await prisma.attendance.findMany({
            where: {
                date: { gte: start, lt: end },
                ...(classId ? { classId } : {}),
            },
            select: {
                id: true,
                studentId: true,
                classId: true,
                teacherId: true,
                status: true,
                date: true,
            },
        })

        return NextResponse.json({
            date: start.toISOString(),
            count: records.length,
            records,
        })
    } catch (error) {
        console.error('Get attendance error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
} 
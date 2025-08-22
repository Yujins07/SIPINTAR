import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
    const body = await request.json()
    const { studentId, status, date } = body
    let classId = body.classId

        if (!studentId || !status) {
            return NextResponse.json({ message: 'studentId and status are required' }, { status: 400 })
        }

        const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 })
        }

        const student = await prisma.student.findUnique({ where: { id: studentId }, include: { user: true } })
        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 })
        }

        // Resolve classId if not provided
        if (!classId) {
            const enrollment = await prisma.classStudent.findFirst({
                where: { studentId },
                select: { classId: true },
            })
            classId = enrollment?.classId
        }

        if (!classId) {
            return NextResponse.json({ message: 'classId is required for this student' }, { status: 400 })
        }

        // Determine teacherId from wali kelas
        const klass = await prisma.class.findUnique({ where: { id: classId }, select: { teacherId: true } })
        const resolvedTeacherId = klass?.teacherId || null
        if (!resolvedTeacherId) {
            return NextResponse.json({ message: 'Unable to resolve teacherId for this class' }, { status: 400 })
        }

        const targetDate = date ? new Date(date) : new Date()
        const start = new Date(targetDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(start.getDate() + 1)

        const existing = await prisma.attendance.findFirst({
            where: {
                studentId,
                classId,
                date: { gte: start, lt: end },
            },
        })

        const record = existing
            ? await prisma.attendance.update({
                  where: { id: existing.id },
                  data: { status, teacherId: resolvedTeacherId },
              })
            : await prisma.attendance.create({
                  data: {
                      date: targetDate,
                      status,
                      studentId,
                      classId,
                      teacherId: resolvedTeacherId,
                      userId: student.userId,
                  },
              })

        return NextResponse.json({ message: 'Updated', record })
    } catch (error) {
        console.error('Manual attendance error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
} 
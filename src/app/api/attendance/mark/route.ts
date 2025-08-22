import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { studentNumber, email, status, classId, date } = await request.json()

        if (!studentNumber && !email) {
            return NextResponse.json({ message: 'Provide studentNumber or email' }, { status: 400 })
        }

        if (!status) {
            return NextResponse.json({ message: 'status is required' }, { status: 400 })
        }

        const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 })
        }

        // Resolve student and user
        const orConditions: object[] = []
        if (studentNumber) orConditions.push({ studentNumber })
        if (email) orConditions.push({ user: { email } })

        const student = await prisma.student.findFirst({
            where: {
                OR: orConditions.length ? orConditions : undefined,
            },
            include: { user: true },
        })

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 })
        }

        // Determine classId: provided or first enrolled class
        let resolvedClassId: string | undefined = classId
        if (!resolvedClassId) {
            const enrollment = await prisma.classStudent.findFirst({
                where: { studentId: student.id },
                select: { classId: true },
            })
            resolvedClassId = enrollment?.classId
        }

        if (!resolvedClassId) {
            return NextResponse.json({ message: 'classId is required for this student' }, { status: 400 })
        }

        // Determine teacherId from the class's wali guru
        const klass = await prisma.class.findUnique({ where: { id: resolvedClassId }, select: { teacherId: true } })
        const resolvedTeacherId = klass?.teacherId || null
        if (!resolvedTeacherId) {
            return NextResponse.json({ message: 'Unable to resolve teacherId for this class' }, { status: 400 })
        }

        const targetDate = date ? new Date(date) : new Date()
        const start = new Date(targetDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(start.getDate() + 1)

        // Upsert attendance for that day
        const existing = await prisma.attendance.findFirst({
            where: {
                studentId: student.id,
                classId: resolvedClassId,
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
                      studentId: student.id,
                      teacherId: resolvedTeacherId,
                      classId: resolvedClassId,
                      userId: student.userId,
                  },
              })

        return NextResponse.json({ message: 'Marked', record })
    } catch (error) {
        console.error('Mark attendance error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
} 
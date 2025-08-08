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

        // Check if user has permission (Admin or Teacher)
        if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            )
        }

        // Get all classes with related data
        const classes = await prisma.class.findMany({
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                subject: {
                    select: {
                        name: true,
                        code: true,
                    },
                },
                _count: {
                    select: {
                        students: true,
                    },
                },
            },
            orderBy: [
                { grade: 'asc' },
                { section: 'asc' },
                { name: 'asc' },
            ],
        })

        return NextResponse.json(classes)
    } catch (error) {
        console.error('Get classes error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
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

        // Check if user has permission (Admin only)
        if (decoded.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            )
        }

        const {
            name,
            grade,
            section,
            maxStudents,
            room,
            teacherId,
            subjectId,
        } = await request.json()

        // Validate required fields
        if (!name || !grade || !section || !maxStudents || !room || !teacherId || !subjectId) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if teacher and subject exist
        const teacher = await prisma.teacher.findUnique({
            where: { id: teacherId },
        })

        if (!teacher) {
            return NextResponse.json(
                { message: 'Teacher not found' },
                { status: 400 }
            )
        }

        const subject = await prisma.subject.findUnique({
            where: { id: subjectId },
        })

        if (!subject) {
            return NextResponse.json(
                { message: 'Subject not found' },
                { status: 400 }
            )
        }

        // Create class
        const newClass = await prisma.class.create({
            data: {
                name,
                grade,
                section,
                maxStudents: parseInt(maxStudents),
                room,
                teacherId,
                subjectId,
            },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                subject: {
                    select: {
                        name: true,
                        code: true,
                    },
                },
                _count: {
                    select: {
                        students: true,
                    },
                },
            },
        })

        return NextResponse.json({
            message: 'Class created successfully',
            class: newClass,
        })
    } catch (error) {
        console.error('Create class error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

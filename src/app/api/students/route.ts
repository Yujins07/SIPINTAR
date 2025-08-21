import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
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

        // Get all students with user information
        const students = await prisma.student.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        isActive: true,
                    },
                },
                classEnrollments: {
                    include: {
                        class: {
                            select: {
                                name: true,
                                grade: true,
                                section: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                studentNumber: 'asc',
            },
        })

        return NextResponse.json(students)
    } catch (error) {
        console.error('Get students error:', error)
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
            email,
            password,
            studentNumber,
            dateOfBirth,
            address,
            phone,
            parentName,
            parentPhone,
            emergencyContact,
        } = await request.json()

        // Validate required fields
        if (!name || !email || !password || !studentNumber || !dateOfBirth || !address || !parentName || !parentPhone) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if email or student number already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            )
        }

        const existingStudent = await prisma.student.findUnique({
            where: { studentNumber },
        })

        if (existingStudent) {
            return NextResponse.json(
                { message: 'Student number already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user and student in a transaction
        const result = await prisma.$transaction(async (tx: import('@prisma/client').Prisma.TransactionClient) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'STUDENT',
                },
            })

            // Create student profile
            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    studentNumber,
                    dateOfBirth: new Date(dateOfBirth),
                    address,
                    phone,
                    parentName,
                    parentPhone,
                    emergencyContact,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            isActive: true,
                        },
                    },
                },
            })

            return student
        })

        return NextResponse.json({
            message: 'Student created successfully',
            student: result,
        })
    } catch (error) {
        console.error('Create student error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as { role: string }
        if (decoded.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 })
        }

        const { id } = await request.json()
        if (!id) {
            return NextResponse.json({ message: 'Missing student id' }, { status: 400 })
        }

        // delete student and user transactionally
        await prisma.$transaction(async (tx) => {
            // find student to get userId
            const student = await tx.student.findUnique({ where: { id } })
            if (!student) throw new Error('Student not found')

            await tx.student.delete({ where: { id } })
            await tx.user.delete({ where: { id: student.userId } })
        })

        return NextResponse.json({ message: 'Student deleted' })
    } catch (error) {
        console.error('Delete student error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as { role: string }
        if (decoded.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Insufficient permissions' }, { status: 403 })
        }

        const body = await request.json()
        const { id, name, email, phone, address, parentName, parentPhone } = body
        if (!id) return NextResponse.json({ message: 'Missing student id' }, { status: 400 })

        // update user and student
        const result = await prisma.$transaction(async (tx) => {
            const student = await tx.student.update({
                where: { id },
                data: {
                    phone,
                    address,
                    parentName,
                    parentPhone,
                },
            })

            const user = await tx.user.update({
                where: { id: student.userId },
                data: { name, email },
            })

            return { student, user }
        })

        return NextResponse.json({ message: 'Student updated', ...result })
    } catch (error) {
        console.error('Update student error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

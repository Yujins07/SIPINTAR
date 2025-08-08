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

        // Get all teachers with user information
        const teachers = await prisma.teacher.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        isActive: true,
                    },
                },
                subjects: {
                    select: {
                        name: true,
                        code: true,
                    },
                },
            },
            orderBy: {
                teacherNumber: 'asc',
            },
        })

        return NextResponse.json(teachers)
    } catch (error) {
        console.error('Get teachers error:', error)
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
            teacherNumber,
            specialization,
            qualification,
            experience,
            phone,
            address,
        } = await request.json()

        // Validate required fields
        if (!name || !email || !password || !teacherNumber || !specialization || !qualification || experience === undefined) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if email or teacher number already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            )
        }

        const existingTeacher = await prisma.teacher.findUnique({
            where: { teacherNumber },
        })

        if (existingTeacher) {
            return NextResponse.json(
                { message: 'Teacher number already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user and teacher in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'TEACHER',
                },
            })

            // Create teacher profile
            const teacher = await tx.teacher.create({
                data: {
                    userId: user.id,
                    teacherNumber,
                    specialization,
                    qualification,
                    experience: parseInt(experience),
                    phone,
                    address,
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

            return teacher
        })

        return NextResponse.json({
            message: 'Teacher created successfully',
            teacher: result,
        })
    } catch (error) {
        console.error('Create teacher error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

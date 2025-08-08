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

        // Get all subjects
        const subjects = await prisma.subject.findMany({
            where: {
                isActive: true,
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
                _count: {
                    select: {
                        classes: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return NextResponse.json(subjects)
    } catch (error) {
        console.error('Get subjects error:', error)
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
            code,
            description,
            credits,
            teacherId,
        } = await request.json()

        // Validate required fields
        if (!name || !code || !teacherId) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if code already exists
        const existingSubject = await prisma.subject.findUnique({
            where: { code },
        })

        if (existingSubject) {
            return NextResponse.json(
                { message: 'Subject code already exists' },
                { status: 400 }
            )
        }

        // Check if teacher exists
        const teacher = await prisma.teacher.findUnique({
            where: { id: teacherId },
        })

        if (!teacher) {
            return NextResponse.json(
                { message: 'Teacher not found' },
                { status: 400 }
            )
        }

        // Create subject
        const subject = await prisma.subject.create({
            data: {
                name,
                code,
                description,
                credits: parseInt(credits) || 1,
                teacherId,
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
            },
        })

        return NextResponse.json({
            message: 'Subject created successfully',
            subject,
        })
    } catch (error) {
        console.error('Create subject error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

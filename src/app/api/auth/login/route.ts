import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                student: true,
                teacher: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
            process.env.NEXTAUTH_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        )

        // Prepare user data for response
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            profileImage: user.profileImage,
            ...(user.student && { studentId: user.student.id, studentNumber: user.student.studentNumber }),
            ...(user.teacher && { teacherId: user.teacher.id, teacherNumber: user.teacher.teacherNumber }),
        }

        return NextResponse.json({
            message: 'Login successful',
            token,
            user: userData,
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

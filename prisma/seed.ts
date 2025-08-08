import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Create Admin User
    const adminPassword = await hashPassword('admin123')
    await prisma.user.create({
        data: {
            email: 'admin@sipintar.com',
            name: 'Administrator',
            password: adminPassword,
            role: 'ADMIN',
        },
    })

    // Create Parent User
    const parentPassword = await hashPassword('parent123')
    await prisma.user.create({
        data: {
            email: 'parent@sipintar.com',
            name: 'Budi Hartono',
            password: parentPassword,
            role: 'PARENT',
        },
    })

    // Create Teacher Users and Teacher profiles
    const teacherPassword = await hashPassword('guru123')

    const teacher1 = await prisma.user.create({
        data: {
            email: 'guru@sipintar.com',
            name: 'Budi Santoso',
            password: teacherPassword,
            role: 'TEACHER',
            teacher: {
                create: {
                    teacherNumber: 'GR001',
                    specialization: 'Matematika',
                    qualification: 'S1 Pendidikan Matematika',
                    experience: 10,
                    phone: '081234567890',
                    address: 'Jl. Pendidikan No. 1, Jakarta',
                },
            },
        },
        include: { teacher: true },
    })

    const teacher2 = await prisma.user.create({
        data: {
            email: 'sari.guru@sipintar.com',
            name: 'Sari Dewi',
            password: teacherPassword,
            role: 'TEACHER',
            teacher: {
                create: {
                    teacherNumber: 'GR002',
                    specialization: 'Bahasa Indonesia',
                    qualification: 'S1 Pendidikan Bahasa Indonesia',
                    experience: 8,
                    phone: '081234567891',
                    address: 'Jl. Bahasa No. 2, Jakarta',
                },
            },
        },
        include: { teacher: true },
    })

    // Create Student User and Student profile
    const studentPassword = await hashPassword('siswa123')
    const student1 = await prisma.user.create({
        data: {
            email: 'siswa@sipintar.com',
            name: 'Ahmad Fauzi',
            password: studentPassword,
            role: 'STUDENT',
            student: {
                create: {
                    studentNumber: 'SW001',
                    dateOfBirth: new Date('2008-05-15'),
                    address: 'Jl. Siswa No. 1, Jakarta',
                    phone: '081234567892',
                    parentName: 'Ali Rahman',
                    parentPhone: '081234567893',
                    emergencyContact: '081234567894',
                },
            },
        },
        include: { student: true },
    })

    const student2 = await prisma.user.create({
        data: {
            email: 'rina.siswa@sipintar.com',
            name: 'Rina Sari',
            password: studentPassword,
            role: 'STUDENT',
            student: {
                create: {
                    studentNumber: 'SW002',
                    dateOfBirth: new Date('2008-08-20'),
                    address: 'Jl. Pelajar No. 2, Jakarta',
                    phone: '081234567895',
                    parentName: 'Joko Widodo',
                    parentPhone: '081234567896',
                    emergencyContact: '081234567897',
                },
            },
        },
        include: { student: true },
    })

    // Create Subjects
    const mathSubject = await prisma.subject.create({
        data: {
            name: 'Matematika',
            code: 'MTK101',
            description: 'Matematika untuk kelas X',
            credits: 4,
            teacherId: teacher1.teacher!.id,
        },
    })

    const indonesianSubject = await prisma.subject.create({
        data: {
            name: 'Bahasa Indonesia',
            code: 'BIN101',
            description: 'Bahasa Indonesia untuk kelas X',
            credits: 3,
            teacherId: teacher2.teacher!.id,
        },
    })

    // Create Classes
    const class1 = await prisma.class.create({
        data: {
            name: 'X-IPA-1',
            grade: 'X',
            section: 'IPA',
            maxStudents: 30,
            room: 'R101',
            teacherId: teacher1.teacher!.id, // Wali kelas
            subjectId: mathSubject.id,
        },
    })

    const class2 = await prisma.class.create({
        data: {
            name: 'X-IPA-1',
            grade: 'X',
            section: 'IPA',
            maxStudents: 30,
            room: 'R102',
            teacherId: teacher2.teacher!.id, // Wali kelas
            subjectId: indonesianSubject.id,
        },
    })

    // Enroll students in classes
    await prisma.classStudent.create({
        data: {
            studentId: student1.student!.id,
            classId: class1.id,
            userId: student1.id,
        },
    })

    await prisma.classStudent.create({
        data: {
            studentId: student1.student!.id,
            classId: class2.id,
            userId: student1.id,
        },
    })

    await prisma.classStudent.create({
        data: {
            studentId: student2.student!.id,
            classId: class1.id,
            userId: student2.id,
        },
    })

    await prisma.classStudent.create({
        data: {
            studentId: student2.student!.id,
            classId: class2.id,
            userId: student2.id,
        },
    })

    // Create sample attendance records
    const today = new Date()
    await prisma.attendance.create({
        data: {
            date: today,
            status: 'PRESENT',
            studentId: student1.student!.id,
            teacherId: teacher1.teacher!.id,
            classId: class1.id,
            userId: student1.id,
        },
    })

    await prisma.attendance.create({
        data: {
            date: today,
            status: 'PRESENT',
            studentId: student2.student!.id,
            teacherId: teacher1.teacher!.id,
            classId: class1.id,
            userId: student2.id,
        },
    })

    // Create sample grades
    await prisma.grade.create({
        data: {
            type: 'QUIZ',
            score: 85,
            maxScore: 100,
            description: 'Quiz Matematika Bab 1',
            date: today,
            studentId: student1.student!.id,
            teacherId: teacher1.teacher!.id,
            subjectId: mathSubject.id,
            classId: class1.id,
            userId: student1.id,
        },
    })

    await prisma.grade.create({
        data: {
            type: 'ASSIGNMENT',
            score: 90,
            maxScore: 100,
            description: 'Tugas Bahasa Indonesia',
            date: today,
            studentId: student1.student!.id,
            teacherId: teacher2.teacher!.id,
            subjectId: indonesianSubject.id,
            classId: class2.id,
            userId: student1.id,
        },
    })

    // Create Academic Year
    await prisma.academicYear.create({
        data: {
            name: '2024/2025',
            startDate: new Date('2024-07-01'),
            endDate: new Date('2025-06-30'),
            isActive: true,
        },
    })

    console.log('✅ Database seeding completed!')
    console.log('\n📝 Demo accounts created:')
    console.log('👨‍💼 Admin: admin@sipintar.com / admin123')
    console.log('👨‍🏫 Guru: guru@sipintar.com / guru123')
    console.log('👨‍🎓 Siswa: siswa@sipintar.com / siswa123')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# SIPINTAR - Sistem Informasi Pintar Sekolah

Ini adalah aplikasi manajemen sekolah yang dibangun dengan Next.js, TypeScript, Prisma ORM, dan MySQL.

## Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Lucide React
- **Styling**: Tailwind CSS

## Struktur Database
Aplikasi ini mengelola:
- **Users**: Admin, Guru, dan Siswa dengan role-based access
- **Students**: Data siswa lengkap dengan informasi orang tua
- **Teachers**: Data guru dengan spesialisasi dan kualifikasi
- **Subjects**: Mata pelajaran yang diajarkan
- **Classes**: Kelas dengan wali kelas dan mata pelajaran
- **Attendance**: Sistem absensi siswa
- **Grades**: Sistem penilaian dengan berbagai jenis nilai
- **Academic Years**: Manajemen tahun akademik

## Fitur Utama
1. **Dashboard Admin**: Kelola seluruh sistem sekolah
2. **Manajemen Siswa**: CRUD siswa, enrollment kelas
3. **Manajemen Guru**: CRUD guru dan assignment mata pelajaran
4. **Manajemen Kelas**: Pembagian kelas dan wali kelas
5. **Sistem Absensi**: Input dan monitoring kehadiran
6. **Sistem Penilaian**: Input nilai dan laporan akademik
7. **Authentication**: Login role-based untuk Admin, Guru, Siswa

## Coding Guidelines
- Gunakan TypeScript untuk type safety
- Implementasikan proper error handling
- Gunakan Prisma untuk database operations
- Ikuti Next.js 15 App Router conventions
- Gunakan server actions untuk form submissions
- Implementasikan proper validation dengan Zod
- Gunakan shadcn/ui design patterns
- Responsive design dengan mobile-first approach

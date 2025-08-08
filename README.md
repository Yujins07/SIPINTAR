# SIPINTAR - Sistem Pemantauan Interaktif dan Pintar
<img width="1342" height="632" alt="Screenshot 2025-08-08 215857" src="https://github.com/user-attachments/assets/22c2c735-c1b8-41be-ab57-3ab2ecc8dfe4" />
<img width="1346" height="630" alt="Screenshot 2025-08-08 213859" src="https://github.com/user-attachments/assets/fa544aea-8a47-43f3-96a7-e3996bedd95c" />

Aplikasi manajemen sekolah modern yang dibangun dengan Next.js, TypeScript, Prisma ORM, dan MySQL.

## ✨ Fitur Utama

- 👨‍💼 **Dashboard Pemantauan Pintar**: Kelola seluruh sistem sekolah dengan analytics
- 👨‍🎓 **Pemantauan Siswa**: CRUD siswa, enrollment kelas, tracking progress real-time
- 👨‍🏫 **Pemantauan Guru**: CRUD guru, assignment mata pelajaran, evaluasi kinerja
- 🏫 **Pemantauan Kelas**: Monitoring aktivitas kelas, wali kelas, mata pelajaran
- ⏰ **Sistem Absensi Interaktif**: Input dan monitoring kehadiran dengan alert otomatis
- 📊 **Sistem Penilaian Pintar**: Input nilai, analitik akademik, insights progress
- 🔐 **Authentication**: Login role-based (Admin, Guru, Siswa)
- 📱 **Responsive Design**: Mobile-first approach
- 📈 **Analytics Dashboard**: Chart dan visualisasi data dengan Recharts

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: JWT dengan bcryptjs
- **UI Components**: Radix UI, Lucide React
- **Charts**: Recharts untuk visualisasi data
- **Styling**: Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MySQL Database
- npm/yarn/pnpm

### Installation

1. **Clone repository** (jika dari git)
   ```bash
   git clone <repository-url>
   cd SIPINTAR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   - Buat database MySQL baru
   - Copy `.env.example` ke `.env`
   - Update connection string database di `.env`:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/sipintar_school"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup Database Schema**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed Database dengan Data Demo**
   ```bash
   npm run db:seed
   ```

6. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

7. **Akses Aplikasi**
   Buka [http://localhost:3000](http://localhost:3000)

## 👥 Demo Accounts

Setelah menjalankan seeding, gunakan akun demo berikut:

- **Admin**: `admin@sipintar.com` / `admin123`
- **Guru**: `guru@sipintar.com` / `guru123`  
- **Siswa**: `siswa@sipintar.com` / `siswa123`

## 📁 Struktur Database

### Users & Roles
- **User**: Base table untuk semua pengguna
- **Student**: Profile siswa dengan data orang tua
- **Teacher**: Profile guru dengan spesialisasi

### Academic Management
- **Subject**: Mata pelajaran yang diajarkan
- **Class**: Kelas dengan wali kelas dan mata pelajaran
- **ClassStudent**: Relasi many-to-many siswa dan kelas
- **AcademicYear**: Tahun akademik

### Operations
- **Attendance**: Sistem absensi harian
- **Grade**: Sistem penilaian dengan berbagai jenis nilai

## 🔧 Available Scripts

```bash
npm run dev          # Jalankan development server
npm run build        # Build untuk production
npm run start        # Jalankan production server
npm run lint         # Jalankan ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema ke database
npm run db:seed      # Seed database dengan data demo
```

## 📐 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── page.tsx        # Homepage
├── lib/                # Utility functions
│   ├── prisma.ts       # Database connection
│   ├── auth.ts         # Authentication helpers
│   └── utils.ts        # General utilities
└── components/         # React components

prisma/
├── schema.prisma       # Database schema
└── seed.ts            # Database seeding script
```

## 🎯 Roadmap

- [ ] NextAuth.js integration
- [ ] Email notifications
- [ ] File upload untuk foto profil
- [ ] Advanced reporting & analytics
- [ ] Mobile app dengan React Native
- [ ] Integration dengan sistem pembayaran
- [ ] Multi-tenant support

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Untuk bantuan dan dukungan:
- Create issue di GitHub
- Email: support@sipintar.com

---
Dibuat dengan ❤️ menggunakan Next.js

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

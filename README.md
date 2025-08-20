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
# SIPINTAR - Sistem Pemantauan Interaktif dan Pintar

SIPINTAR adalah aplikasi manajemen sekolah modern yang dibangun dengan Next.js, TypeScript, Prisma, dan MySQL.

Catatan: README ini sudah diperbarui mengikuti perubahan UI terakhir: penambahan chart interaktif (Recharts), daftar aktivitas absen yang baru, dan sidebar responsif.

## ✨ Sorotan Perubahan UI

- Dashboard kini menampilkan grafik kehadiran per kelas menggunakan Recharts (`src/components/AttendanceChart.tsx`).
   - Grafik menampilkan 5 kelas default (X-1..X-5).
   - Sumbu Y dibatasi hingga 35 siswa per kelas (domain [0, 35]).
   - Menampilkan dua batang per kelas: Hadir (dark blue) dan Tidak Hadir (abu-abu).
- Daftar aktivitas absen terbaru menggunakan `src/components/AbsentActivityList.tsx` dengan dummy 10 entri.
   - Contoh entri: "Ahmad sudah absen pada jam 07:30".
   - Komponen hadir dalam versi compact (kanan dashboard) dan full list (opsional).
- Sidebar navigasi tersedia di `src/components/Sidebar.tsx` dan dipakai pada layout dashboard.

## 🛠 Tech Stack (ringkasan)

- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS
- Charts: Recharts
- Database: MySQL + Prisma
- Auth: next-auth / custom (see `src/lib/auth.ts`)

## 🚀 Jalankan secara lokal

Persyaratan: Node.js 18+, MySQL.

1. Install deps

```powershell
npm install
```

2. Setup environment

- Salin `.env.example` ke `.env` dan sesuaikan `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.

3. Database

```powershell
npx prisma db push
npx prisma generate
npm run db:seed
```

4. Jalankan dev server

```powershell
npm run dev
```

5. Buka aplikasi di http://localhost:3000

## ⛳ Struktur penting (ringkas)

- `src/app/dashboard/admin/page.tsx` — halaman dashboard admin (menggunakan `AttendanceChart`, `AbsentActivityList`, `Sidebar`).
- `src/components/AttendanceChart.tsx` — grafik kehadiran (Recharts).
- `src/components/AbsentActivityList.tsx` — daftar aktivitas absen (dummy data).
- `src/components/Sidebar.tsx` — navigasi kiri (desktop) + drawer (mobile).

## 🔧 Perintah tersedia

```powershell
npm run dev      # development
npm run build    # build production
npm run start    # run production
npm run lint     # lint project
npm run db:seed  # seed demo data
```

## 💡 Catatan pengembangan & penyesuaian

- Grafik saat ini menggunakan sample data (X-1..X-5). Untuk menampilkan data nyata, panggil API dan kirim hasil ke `<AttendanceChart data={...} />`.
- Y-axis digolongkan 0..35. Jika Anda ingin menampilkan proporsi untuk dataset yang melebihi 35, ada dua opsi:
   - normalisasi sebelum dikirim ke grafik, atau
   - ubah domain sumbu Y sesuai data aktual.
- `AbsentActivityList` menerima data dummy internal; mudah untuk diubah agar menerima prop `data` dari API.

## ✅ Checklist kualitas yang sudah dijalankan

- Build: `npm run build` — berhasil.
- Lint & type check: berhasil.

## 🆘 Bantuan

Jika butuh integrasi API untuk charts atau aktivitas absen, beri tahu endpoint yang diinginkan dan saya akan membantu menghubungkannya.

---

Terima kasih — mari lanjutkan mempercantik dan menyambungkan data nyata jika diperlukan.

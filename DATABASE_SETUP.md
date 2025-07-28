# 📊 Setup Database MySQL untuk SIPINTAR

## 🚀 Langkah Setup Database yang Sudah Berhasil

### ✅ Yang Sudah Selesai:
1. **Database Schema**: Tabel-tabel sudah berhasil dibuat di MySQL
2. **Data Demo**: Database sudah terisi dengan data demo
3. **Konfigurasi**: File .env sudah dikonfigurasi dengan benar

### 🎯 Cara Setup Database dari Awal

#### **Opsi 1: Menggunakan XAMPP (Recommended untuk Development)**

1. **Download dan Install XAMPP**
   - Download dari: https://www.apachefriends.org/
   - Install dengan default settings

2. **Start Services**
   - Buka XAMPP Control Panel
   - Start **Apache** dan **MySQL**

3. **Buat Database via phpMyAdmin**
   - Buka http://localhost/phpmyadmin
   - Klik "New" di sidebar kiri
   - Database name: `sipintar_school`
   - Collation: `utf8mb4_unicode_ci`
   - Klik "Create"

#### **Opsi 2: Install MySQL Server Langsung**

1. **Download MySQL**
   - Download dari: https://dev.mysql.com/downloads/installer/
   - Pilih "MySQL Installer for Windows"

2. **Install MySQL**
   - Jalankan installer
   - Pilih "Developer Default"
   - Set root password (ingat password ini!)

3. **Buat Database**
   ```sql
   # Login ke MySQL Command Line atau MySQL Workbench
   CREATE DATABASE sipintar_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 🔧 Konfigurasi Aplikasi

1. **Edit file .env**
   ```env
   # Jika menggunakan XAMPP (default tanpa password)
   DATABASE_URL="mysql://root:@localhost:3306/sipintar_school"
   
   # Jika MySQL dengan password
   DATABASE_URL="mysql://root:your_password@localhost:3306/sipintar_school"
   
   # Jika buat user khusus
   DATABASE_URL="mysql://sipintar_user:sipintar_password@localhost:3306/sipintar_school"
   ```

2. **Push Schema ke Database**
   ```bash
   npx prisma db push
   ```

3. **Seed Database dengan Data Demo**
   ```bash
   npm run db:seed
   ```

### 🎯 Test Connection

Setelah setup, test dengan:

```bash
# Test koneksi database
npx prisma studio

# Atau jalankan development server
npm run dev
```

### 🔐 Demo Accounts yang Tersedia

Setelah seeding berhasil, gunakan akun berikut untuk login:

- **👨‍💼 Admin**: 
  - Email: `admin@sipintar.com`
  - Password: `admin123`

- **👨‍🏫 Guru**: 
  - Email: `guru@sipintar.com`
  - Password: `guru123`

- **👨‍🎓 Siswa**: 
  - Email: `siswa@sipintar.com`
  - Password: `siswa123`

### 🗄️ Struktur Database yang Sudah Dibuat

Tabel-tabel berikut sudah otomatis dibuat:

```
📊 Database: sipintar_school
├── 👥 users (Base table untuk semua user)
├── 👨‍🎓 students (Profile siswa)
├── 👨‍🏫 teachers (Profile guru)
├── 📚 subjects (Mata pelajaran)
├── 🏫 classes (Kelas)
├── 📝 class_students (Relasi siswa-kelas)
├── ⏰ attendances (Absensi)
├── 📊 grades (Nilai)
└── 📅 academic_years (Tahun akademik)
```

### 🛠️ Commands yang Berguna

```bash
# Lihat database di browser
npx prisma studio

# Reset database (hati-hati, akan hapus semua data!)
npx prisma db push --force-reset

# Generate Prisma Client setelah perubahan schema
npx prisma generate

# Seed ulang database
npm run db:seed
```

### ⚠️ Troubleshooting

**Error: "Can't connect to MySQL server"**
- Pastikan MySQL service berjalan
- Cek XAMPP Control Panel atau Windows Services

**Error: "Database doesn't exist"**
- Buat database `sipintar_school` dulu via phpMyAdmin atau MySQL Command Line

**Error: "Access denied for user"**
- Cek username/password di .env
- Untuk XAMPP default: user=root, password=kosong

### ✅ Status Saat Ini

Database sudah berhasil disetup dengan:
- ✅ 1 Admin user
- ✅ 2 Teacher users  
- ✅ 2 Student users
- ✅ 2 Subjects (Matematika, Bahasa Indonesia)
- ✅ 2 Classes
- ✅ Sample attendance records
- ✅ Sample grades
- ✅ Active academic year 2024/2025

**🎉 Aplikasi siap digunakan! Buka http://localhost:3000 dan login dengan demo accounts di atas.**

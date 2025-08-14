# Login ke MySQL
mysql -u root -p

# Buat database baru
CREATE DATABASE sipintar_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Buat user khusus 
CREATE USER 'sipintar_user'@'%' IDENTIFIED BY 'sipintar_password123';

# Berikan akses ke database
GRANT ALL PRIVILEGES ON sipintar_school.* TO 'sipintar_user'@'%';

# Refresh privileges
FLUSH PRIVILEGES;

# Keluar dari MySQL
EXIT;

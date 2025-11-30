# Proyek: Azure Autoscale Express App

## Ringkasan
Aplikasi web Node.js + Express yang siap di-deploy ke Azure App Service dengan autoscaling otomatis, load balancing bawaan Azure, dan monitoring via Application Insights. Termasuk endpoint untuk pengujian dan logging jumlah request.

## Fitur
- Halaman utama teks: "Aplikasi ini telah berhasil di-deploy dan scalable melalui Azure!"
- Endpoint `GET /test` mengembalikan JSON berisi `message` dan `timestamp`.
- Middleware logging: console log dan penghitung jumlah request.
- Port mengikuti `process.env.PORT` (default 3000).
- Integrasi Application Insights jika environment disediakan.

## Struktur Project
```
.
├─ src/
│  └─ server.js
├─ package.json
└─ README.md
```

## Prasyarat
- Akun Azure aktif
- GitHub account
- Node.js 20+ (disarankan 20 LTS atau 22 LTS; 24 juga didukung) dan npm

## Cara Menjalankan Lokal
1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan server:
   ```bash
   npm start
   ```
3. Buka `http://localhost:3000/` dan `http://localhost:3000/test`.
4. Opsi monitoring lokal (opsional): set environment `APPINSIGHTS_CONNECTION_STRING` atau `APPINSIGHTS_INSTRUMENTATIONKEY` sebelum `npm start`.

---

## Deployment ke Azure App Service

### 1) Push Repository ke GitHub
- Buat repository baru di GitHub.
- Inisiasi dan push:
  ```bash
  git init
  git add .
  git commit -m "Initial Azure autoscale Express app"
  git branch -M main
  git remote add origin https://github.com/<USERNAME>/<REPO>.git
  git push -u origin main
  ```

### 2) Hubungkan GitHub ke Azure App Service
- Buka Azure Portal.
- Buat `App Service` baru:
  - Publish: `Code`
  - Runtime stack: `Node 20 LTS` (atau `Node 22 LTS`, `Node 24`)
  - Region: pilih sesuai kebutuhan
- Setelah dibuat, buka resource App Service → Deployment Center.
- Pilih `GitHub`, pilih repository dan branch `main`. Simpan.
- Setelah deployment selesai, buka `https://YOUR_APP.azurewebsites.net/`.

### 3) Konfigurasi Autoscale
- Buka resource App Service → `Scale out (App Service Plan)` → `Custom autoscale`.
- Buat profile:
  - Minimum instance: `1`
  - Maximum instance: `5`
- Tambah rule berbasis CPU:
  - Metric: `CPU Percentage`
  - Condition: `Greater than 70%`
  - Time aggregation: `Average`
  - Duration: `5 minutes`
  - Action: `Increase count by 1`
- Tambah rule berbasis Requests (opsional jika tersedia di plan):
  - Metric: `Requests`
  - Condition & threshold sesuai target beban
  - Action: scale out sesuai kebutuhan
- Simpan profile.

### 4) Aktifkan Application Insights
- Di App Service → `Application Insights` → `Turn on Application Insights`.
- Pilih instance baru atau yang sudah ada.
- Pastikan `Connection string` terpasang sebagai setting aplikasi (otomatis oleh portal).
- Restart App Service jika diperlukan.

---

## Pengujian Load Testing

### Apache Benchmark (ab)
Jalankan dari mesin lokal atau dari VM yang dekat region Azure untuk hasil akurat:
```bash
ab -n 2000 -c 200 https://YOUR_APP.azurewebsites.net/
```
Uji endpoint API juga:
```bash
ab -n 2000 -c 200 https://YOUR_APP.azurewebsites.net/test
```

### Metrics yang Diamati
- Requests per second
- Average response time
- Autoscale event log
- CPU percentage dan instance count
- Application Insights: request rate, failure rate, response time

---

## Arsitektur Scalable & Reliable
- Platform: Azure App Service (managed, auto load balancing)
- Autoscale horizontal berdasarkan CPU dan jumlah request
- Stateles API dengan Express, aman untuk scale out
- Observability dengan Application Insights

## Environment Variables
- `PORT`: port yang dipakai oleh server (disediakan oleh App Service)
- `APPINSIGHTS_CONNECTION_STRING` atau `APPINSIGHTS_INSTRUMENTATIONKEY`: konfigurasi monitoring

---

## Placeholder Screenshot
Ganti file berikut dengan hasil pengujian Anda:
- ![Azure CPU Metrics](docs/images/cpu-metrics.png)
- ![Autoscale Triggered](docs/images/autoscale-trigger.png)
- ![Load Test Results](docs/images/load-test-results.png)

Direktori `docs/images/` dapat Anda buat dan isi dengan tangkapan layar saat menyusun laporan.

---

## Troubleshooting
- 404/502: periksa logs di App Service → Log stream
- Tidak scale out: cek autoscale rules, metric source, dan plan tier
- Insights kosong: pastikan connection string tersedia dan restart aplikasi

---

## Lisensi
MIT

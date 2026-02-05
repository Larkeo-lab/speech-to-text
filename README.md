# Smart ODS AI - บริการแปลงเสียงเป็นข้อความ (Speech to Text)

## ภาพรวม (Overview)
โปรเจกต์นี้เป็นบริการ Backend สำหรับ Smart ODS AI ซึ่งมีฟีเจอร์หลักคือโมดูลแปลงเสียงเป็นข้อความ (Speech-to-Text) ที่เชื่อมต่อกับ Google Cloud Speech API พัฒนาโดยใช้ Node.js, Express และ TypeScript ตามรูปแบบสถาปัตยกรรมที่สะอาด (Clean Architecture)

## คุณสมบัติ (Features)
- **Speech-to-Text**: แปลงไฟล์เสียงเป็นข้อความโดยใช้ Google Cloud Speech API
- **รองรับภาษา**: ปัจจุบันตั้งค่าไว้สำหรับภาษาลาว (lo-LA)
- **สถาปัตยกรรม**: โครงสร้างแบบแยกโมดูลตามฟีเจอร์ (`src/features`)
- **การตรวจสอบข้อมูล**: ใช้ Zod ในการตรวจสอบ Request
- **ฐานข้อมูล**: ใช้ Prisma ORM ร่วมกับ PostgreSQL

## สิ่งที่ต้องเตรียม (Prerequisites)
- Node.js (แนะนำเวอร์ชัน 18 ขึ้นไป)
- pnpm
- Docker & Docker Compose
- Google Cloud Service Account (สำหรับ Speech API)

## การติดตั้ง (Installation)

1.  **Clone repository**
    ```bash
    git clone <repository-url>
    cd speech-to-text
    ```

2.  **ติดตั้ง dependencies**
    ```bash
    pnpm install
    ```

3.  **ตั้งค่าสิ่งแวดล้อม (Environment Setup)**
    - สร้างไฟล์ `.env` หากยังไม่มี
    - นำไฟล์ `service-account.json` ของ Google Cloud มาวางไว้ที่ root directory
    - **สำคัญ**: ตรวจสอบให้แน่ใจว่า `service-account.json` ไม่ถูก commit ขึ้น git (ไฟล์นี้ถูกเพิ่มใน .gitignore แล้ว)

## การรันแอปพลิเคชัน (Running the Application)

### สำหรับการพัฒนา (Development)
รันในโหมด development พร้อม hot-reloading:
```bash
pnpm dev
```

### สำหรับ Production
Build และเริ่มรัน server:
```bash
pnpm build
pnpm start
```

## คู่มือ API (API Documentation)

### Speech to Text
**Endpoint**: `POST /api/v1/speech/transcribe`

**Headers**:
- `Content-Type`: `multipart/form-data`

**Body**:
- `audio`: ไฟล์เสียงที่ต้องการแปลงข้อความ (เช่น .wav, .mp3)

**ตัวอย่าง (cURL)**:
```bash
curl -X POST http://localhost:8082/api/v1/speech/transcribe \
  -F "audio=@/path/to/audio.wav"
```

**ตัวอย่างการตอบกลับที่สำเร็จ (Success Response)**:
```json
{
  "status": "success",
  "data": {
    "transcription": "ສະບາຍດີ..."
  }
}
```

## โครงสร้างโปรเจกต์ (Project Structure)
```
src/
├── features/           # โมดูลแยกตามฟีเจอร์ (เช่น speech-to-text)
├── shared/             # ยูทิลิตี้ที่ใช้ร่วมกัน, middlewares, exceptions
├── config/             # ไฟล์การตั้งค่า (DB, Env, ฯลฯ)
├── app.ts              # การตั้งค่า Express App
└── server.ts           # จุดเริ่มต้นของ Server (Entry point)
```

## สคริปต์คำสั่ง (Scripts)
- `pnpm dev`: รัน dev server
- `pnpm build`: Build สำหรับ production
- `pnpm lint`: ตรวจสอบโค้ดด้วย Biome
- `pnpm format`: จัดรูปแบบโค้ดด้วย Biome
- `pnpm db:migrate`: รัน Prisma migrations

## ใบอนุญาต (License)
ISC

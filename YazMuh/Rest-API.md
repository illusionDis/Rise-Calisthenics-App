# AshuraForge REST API

> **Domain:** `https://ashuraforge-api.railway.app`  
> **Swagger UI:** `https://ashuraforge-api.railway.app/index.html`

---

## Gereksinimler ve Uç Noktalar

### GEREKSİNİM 1 – Kayıt ol
**POST** `/api/auth/register`

**Body:**
```json
{
  "username": "neset",
  "email": "neset@example.com",
  "password": "123456"
}
```
**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "Kayıt başarılı! Hoş geldiniz.",
  "data": {
    "token": "eyJhbGciOi...",
    "username": "neset",
    "email": "neset@example.com",
    "title": "Acemi Savaşçı",
    "expiresAt": "2025-01-02T12:00:00Z"
  }
}
```

---

### GEREKSİNİM 2 – Giriş yap
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "neset@example.com",
  "password": "123456"
}
```

---

### GEREKSİNİM 3 – Antrenman ekle
**POST** `/api/workout`  
🔒 *Auth gerekli*

**Body:**
```json
{
  "name": "Sabah Koşusu",
  "description": "5 km hafif koşu",
  "category": "Cardio",
  "durationMinutes": 30
}
```

---

### GEREKSİNİM 4 – Antrenman sil
**DELETE** `/api/workout/{id}`  
🔒 *Auth gerekli*

---

### GEREKSİNİM 5 – Rozet kazan
**PATCH** `/api/badge/check`  
🔒 *Auth gerekli*

> Not: Rozet kontrolü otomatik olarak antrenman eklendikten sonra da tetiklenir.

---

### GEREKSİNİM 6 – Bildirim al
**GET** `/api/notification`  
🔒 *Auth gerekli*

---

### GEREKSİNİM 7 – Profil fotoğrafı değiştir
**PUT** `/api/profile/image`  
🔒 *Auth gerekli*

**Body:**
```json
{
  "profileImageUrl": "https://example.com/avatar.png"
}
```

---

### GEREKSİNİM 8 – Profil düzenle
**PATCH** `/api/profile`  
🔒 *Auth gerekli*

**Body:**
```json
{
  "username": "yeniIsim",
  "email": "yeni@email.com",
  "currentPassword": "eskiSifre",
  "newPassword": "yeniSifre"
}
```

---

### GEREKSİNİM 9 & 10 – Title kazan + Progress tracking
**GET** `/api/progress`  
🔒 *Auth gerekli*

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "data": {
    "currentTitle": "Bronz Savaşçı",
    "totalWorkouts": 7,
    "totalMinutes": 210,
    "badgeCount": 2,
    "nextTitle": "Gümüş Savaşçı",
    "workoutsToNextTitle": 8,
    "recentWorkouts": [...],
    "earnedBadges": [...]
  }
}
```

---

## Title Seviyeleri (Gereksinim 9)

| Antrenman Sayısı | Unvan |
|---|---|
| 0 | Acemi Savaşçı |
| 5 | Bronz Savaşçı |
| 15 | Gümüş Savaşçı |
| 30 | Altın Savaşçı |
| 50 | Platin Savaşçı |
| 75 | Elmas Savaşçı |
| 100 | Efsane Savaşçı |

## Rozet Seviyeleri (Gereksinim 5)

| Gerekli Antrenman | Rozet |
|---|---|
| 1 | 🏃 İlk Adım |
| 5 | 🔥 Isınma |
| 15 | 💪 Demir İrade |
| 30 | ⚡ Kesintisiz Güç |
| 50 | ⚔️ Savaşçı Ruhu |
| 100 | 👑 Efsane |

---

## Authentication

Tüm 🔒 işaretli endpoint'ler için Header'a ekleyin:
```
Authorization: Bearer {token}
```

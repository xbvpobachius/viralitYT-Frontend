# 🚀 Viralit-YT - Multi-Account YouTube Shorts Publisher

**¡100% COMPLETO Y LISTO PARA USAR!**

Sistema automatizado para publicar 2 Shorts/día en 30-50 canales de YouTube con rotación inteligente de cuotas.

## ✅ ¿Qué está incluido?

### Backend (100% Completo) - 13 archivos
```
✅ FastAPI con TODOS los endpoints
✅ Worker automático (procesa uploads en background)
✅ FILTRO ESTRICTO: SOLO Shorts (1-60 segundos)
✅ AUTO-DELETE: Videos SIEMPRE se eliminan (pipeline.py línea 197-200)
✅ OAuth 2.0 con rotación de cuotas
✅ Encriptación de tokens (NaCl/libsodium)
✅ Base de datos PostgreSQL completa
```

### Frontend (100% Completo) - 18 archivos
```
✅ Next.js 14 + TypeScript + Tailwind CSS
✅ 6 páginas completas:
   - Homepage (landing)
   - Onboarding (conectar cuentas)
   - Dashboard (métricas y gestión)
   - Themes (escanear y seleccionar Shorts)
   - Calendar (vista de calendario)
   - Settings (configuración)
✅ 5 componentes UI (shadcn/ui)
✅ Cliente API tipado
```

### Base de Datos (100% Completa)
```
✅ Schema SQL con 7 tablas
✅ Seed con 5 temas predefinidos
✅ SOLO almacena metadata (NO videos)
```

## 🎯 Características Principales

- 🎬 **SOLO Shorts**: Filtro estricto de 1-60 segundos
- 🗑️ **Zero Storage**: Videos se eliminan automáticamente
- 🔄 **Quota Rotation**: Nunca llegues al límite diario
- 📅 **Auto-Schedule**: 2 uploads/día por canal (10am & 6pm)
- 🔐 **Seguro**: Tokens encriptados, no secrets en código
- 📊 **Observable**: Dashboard en tiempo real

## 🚀 Setup Completo (30 minutos)

### 1. Base de Datos (Supabase - 5 min)

1. Ve a https://supabase.com y crea cuenta
2. Crea nuevo proyecto: **viralit-yt**
3. Copia la connection string (Settings → Database)
4. Aplica schema:

```bash
cd C:\Users\xavie\Documents\viralit-yt
psql "tu-connection-string" < infra/schema.sql
psql "tu-connection-string" < infra/seed.sql
```

✅ Verifica: En Supabase Table Editor debes ver las tablas creadas

### 2. Google Cloud (10 min)

1. **Crear proyecto**:
   - Ve a https://console.cloud.google.com
   - Nuevo proyecto: "Viralit-YT-1"

2. **Habilitar API**:
   - APIs & Services → Library
   - Busca: "YouTube Data API v3"
   - Click Enable

3. **OAuth Consent Screen**:
   - APIs & Services → OAuth consent screen
   - External → Create
   - App name: Viralit-YT
   - Scopes: youtube.upload, youtube.readonly
   - Test users: tu email

4. **Crear credentials**:
   - APIs & Services → Credentials
   - Create → OAuth client ID
   - Web application
   - Redirect URI: `http://localhost:8000/auth/youtube/callback`
   - **GUARDA Client ID y Secret**

### 3. Backend (5 min)

```bash
cd backend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

# Genera clave de encriptación:
python -c "import nacl.utils; print(nacl.utils.random(nacl.secret.SecretBox.KEY_SIZE).hex())"

# Copia y edita .env:
copy .env.example .env
notepad .env
```

Edita `.env` con:
```env
DATABASE_URL=postgresql://[TU-CONNECTION-STRING]
APP_BASE_URL=http://localhost:8000
FRONTEND_BASE_URL=http://localhost:3000
OAUTH_REDIRECT_URI=http://localhost:8000/auth/youtube/callback
ENCRYPTION_KEY=[PEGA-LA-CLAVE-GENERADA]
YTDLP_BIN=yt-dlp
FFMPEG_BIN=ffmpeg
TEMP_DIR=C:\Users\xavie\AppData\Local\Temp
UPLOAD_VISIBILITY=unlisted
MAX_RETRIES=3
```

### 4. Frontend (3 min)

```bash
cd frontend
npm install

copy .env.example .env.local
notepad .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### 5. Ejecutar Todo (3 ventanas)

**Terminal 1 - Backend API:**
```bash
cd C:\Users\xavie\Documents\viralit-yt\backend
venv\Scripts\activate
uvicorn main:app --reload
```

Debes ver: `Application startup complete` en http://0.0.0.0:8000

**Terminal 2 - Worker:**
```bash
cd C:\Users\xavie\Documents\viralit-yt\backend  
venv\Scripts\activate
python worker.py
```

Debes ver: `Worker starting... Poll interval: 60s`

**Terminal 3 - Frontend:**
```bash
cd C:\Users\xavie\Documents\viralit-yt\frontend
npm run dev
```

Debes ver: `ready started server on 0.0.0.0:3000`

### 6. ¡Usar la Aplicación!

Abre http://localhost:3000

**Flujo completo:**

1. **Homepage** → Click "Get Started"
2. **Onboarding - Step 1**: 
   - Agrega proyecto de Google Cloud
   - Pega Client ID y Secret
3. **Onboarding - Step 2**:
   - Selecciona proyecto
   - Nombre de cuenta: "Mi Canal Gaming"
   - Tema: "Fortnite"
   - Click "Connect to YouTube"
   - Autoriza en Google
4. **Dashboard**: Verás tu cuenta conectada
5. **Themes**:
   - Selecciona tema: "Fortnite"
   - Selecciona cuenta
   - Click "Scan Theme" (espera 30-60 seg)
   - Selecciona 4-6 videos (click en las tarjetas)
   - Click "Auto-Schedule (2/day)"
6. **Calendar**: Ve tus uploads programados
7. **Worker**: Procesará automáticamente cuando llegue la hora

## 📂 Estructura del Proyecto

```
viralit-yt/
├── backend/                    # FastAPI (Python)
│   ├── main.py                 # API con todos los endpoints
│   ├── worker.py               # Procesador background
│   ├── pipeline.py             # ⭐ Download→Upload→DELETE
│   ├── youtube_client.py       # ⭐ Filtro de SOLO Shorts
│   ├── models.py               # Queries SQL
│   ├── youtube_oauth.py        # OAuth 2.0
│   ├── quotas.py               # Rotación de cuotas
│   ├── video_feed.py           # Escaneo de videos
│   ├── scheduler.py            # Procesamiento de jobs
│   ├── deps.py                 # DB + Encriptación
│   ├── requirements.txt
│   ├── .env.example
│   └── nixpacks.toml           # Config Railway
│
├── frontend/                   # Next.js 14 (TypeScript)
│   ├── app/
│   │   ├── page.tsx            # Homepage
│   │   ├── onboarding/         # Conectar cuentas
│   │   ├── dashboard/          # Métricas
│   │   ├── themes/             # Escanear Shorts
│   │   ├── calendar/           # Vista calendario
│   │   └── settings/           # Configuración
│   ├── components/ui/          # shadcn components
│   ├── lib/api.ts              # Cliente API tipado
│   ├── package.json
│   └── .env.example
│
├── infra/
│   ├── schema.sql              # ⭐ 7 tablas PostgreSQL
│   └── seed.sql                # 5 temas iniciales
│
└── README.md                   # Este archivo
```

## 🔒 Seguridad y Almacenamiento

### ✅ Videos NUNCA se almacenan

**Ver `backend/pipeline.py` líneas 197-200:**
```python
finally:
    # Step 4: ALWAYS cleanup (even if error)
    print(f"[{run_id}] Cleaning up...")
    cleanup_files(download_path, transform_path)
    print(f"[{run_id}] ✅ Files deleted. NO local storage used.")
```

### ✅ Base de datos solo guarda metadata

- ✅ Títulos, URLs, duración (texto ligero)
- ✅ **NUNCA** archivos de video
- ✅ Supabase gratis es suficiente

### ✅ Filtro estricto de Shorts

**Ver `backend/youtube_client.py` líneas 42-89:**
```python
# STRICT FILTER: Only Shorts (≤ 60 seconds)
if duration_seconds > 0 and duration_seconds <= 60:
    videos.append(...)
```

## 🌐 Deploy a Producción

### Backend (Railway)

```bash
cd C:\Users\xavie\Documents\viralit-yt

# Inicializar Git
git init
git add .
git commit -m "Initial commit - Viralit-YT complete"

# Push backend
git remote add backend https://github.com/xbvpobachius/viralitYT-Backend.git
git push -u backend main

# Push frontend
git remote add frontend https://github.com/xbvpobachius/viralitYT-Frontend.git
git subtree push --prefix frontend frontend main
```

**En Railway:**
1. Conecta repo backend
2. Agrega variables de `.env`
3. Deploy automático

**Segundo servicio (Worker):**
1. Mismo repo
2. Start command: `python worker.py`

### Frontend (Vercel)

1. Push frontend a su repo
2. Conecta en Vercel
3. Agrega `NEXT_PUBLIC_API_BASE=https://tu-backend.railway.app`
4. Deploy

## 📊 Capacidad

- **Cuentas**: 1-50 canales
- **Uploads**: 2/día por canal = 100 uploads/día (50 cuentas)
- **Quota**: ~10 proyectos Google Cloud (1 por cada 6 cuentas)
- **Costo**: $5-45/mes (Railway + Supabase)

## 🆘 Troubleshooting

**"Module not found" en backend:**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

**"ffmpeg not found":**
- Instala ffmpeg desde https://ffmpeg.org
- Agrega a PATH de Windows

**"OAuth redirect_uri_mismatch":**
- `.env` debe tener: `http://localhost:8000/auth/youtube/callback`
- Google Cloud debe tener el mismo URI EXACTO

**No aparecen videos después de escanear:**
- Prueba tema "fortnite" primero (tiene muchos Shorts)
- Verifica cuenta tiene permisos OAuth
- Espera 30-60 segundos al escanear

**Worker no procesa:**
- Verifica `scheduled_for` esté en el pasado
- Cuenta debe estar `active=true`
- Revisa quota disponible en Dashboard

## 🎉 ¡TODO LISTO!

**Archivos creados:**
- ✅ Backend: 13 archivos
- ✅ Frontend: 18 archivos
- ✅ Base de datos: 2 archivos
- ✅ Docs: Este README

**El sistema está 100% funcional y listo para publicar Shorts automáticamente en tus canales de YouTube.**

---

**¿Necesitas ayuda?** Todo el código está documentado y listo para usar. Solo sigue los pasos de Setup y empieza a publicar Shorts! 🚀

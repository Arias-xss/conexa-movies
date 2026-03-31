# 🎬 Conexa Backend — Movies API

> API RESTful para la gestión de películas, construida como prueba técnica con arquitectura moderna, autenticación segura y despliegue automatizado.

---

## 📋 Descripción

**Conexa Movies API** es un backend desarrollado con **NestJS** y **TypeScript** que expone endpoints para la administración de películas. Incluye autenticación con JWT, persistencia en MariaDB mediante TypeORM, documentación interactiva con Swagger, y un pipeline de CI/CD configurado con GitHub Actions y Railway.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
|---|---|
| 🟢 **NestJS** | Framework principal de Node.js |
| 🔷 **TypeScript** | Lenguaje de programación tipado |
| 🐬 **MariaDB** | Base de datos relacional |
| 🗂️ **TypeORM** | ORM para la gestión de entidades |
| 🔐 **JWT** | Autenticación y autorización |
| 🐳 **Docker** | Containerización del proyecto |
| ⚙️ **GitHub Actions** | Integración continua y despliegue |
| 📄 **Swagger** | Documentación interactiva de la API |
| 🚂 **Railway** | Plataforma de despliegue CI/CD |

---

## 🌐 Entorno de Pruebas (Producción)

La API se encuentra desplegada y lista para ser explorada:

🔗 **Swagger UI (Producción):**
[https://conexa-movies-production.up.railway.app/docs](https://conexa-movies-production.up.railway.app/docs)

> Podés probar todos los endpoints directamente desde el navegador sin necesidad de configurar nada localmente.

---

## 💻 Cómo Correr el Proyecto Localmente

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/Arias-xss/conexa-movies.git
cd conexa-movies
```

### 2️⃣ Configurar Variables de Entorno

```bash
cp .env.example .env
```

> ✏️ Abrí el archivo `.env` y completá los valores necesarios (credenciales de base de datos, secreto JWT, etc.).

### 3️⃣ Instalar Dependencias

```bash
yarn install
```

### 4️⃣ Levantar los Servicios con Docker

```bash
docker compose up
```

> 🐳 Esto iniciará tanto la API como la base de datos MariaDB en contenedores aislados.

### 5️⃣ Ejecutar los Tests

```bash
yarn test
```

> ✅ Validá que todos los tests pasen correctamente antes de comenzar a explorar la API.

### 6️⃣ Acceder a la Aplicación

Una vez que todo esté corriendo, la API estará disponible en:

```
http://localhost:3000
```

---

## 📖 Documentación de la API

Podés explorar y probar todos los endpoints disponibles desde la interfaz de Swagger:

🔗 **Local:**
[http://localhost:3000/docs](http://localhost:3000/docs)

🔗 **Producción:**
[https://conexa-movies-production.up.railway.app/docs](https://conexa-movies-production.up.railway.app/docs)

> La documentación incluye descripción de cada endpoint, parámetros requeridos, ejemplos de request/response y soporte para autenticación con Bearer Token.

---

## 🧪 Scripts Disponibles

```bash
# Instalar dependencias
yarn install

# Levantar en modo desarrollo
yarn start:dev

# Compilar el proyecto
yarn build

# Ejecutar tests unitarios
yarn test

# Ejecutar tests con cobertura
yarn test:cov
```

---

## 🚀 CI/CD Pipeline

El proyecto cuenta con un pipeline automatizado configurado con **GitHub Actions** que se ejecuta en cada push a la rama principal:

1. ✅ Instalación de dependencias
2. 🧪 Ejecución de tests
3. 🏗️ Build del proyecto
4. 🚂 Despliegue automático en Railway

---

## 📁 Estructura del Proyecto

```
conexa-movies/
├── src/
│   ├── auth/          # Módulo de autenticación (JWT)
│   ├── movies/        # Módulo de películas (CRUD)
│   ├── users/         # Módulo de usuarios
│   └── main.ts        # Entry point
├── test/              # Tests e2e
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 👤 Autor

Desarrollado por **[@Arias-xss](https://github.com/Arias-xss)** como parte de una prueba técnica para **Conexa**.

---

<p align="center">Hecho con ❤️ y ☕</p>
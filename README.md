# 📅 App de Gestión de Citas

Esta es una aplicación web moderna para la gestión eficiente de citas, clientes y servicios, pensada para clínicas, peluquerías, consultorios, spas y cualquier negocio que requiera una agenda organizada y digitalizada. El proyecto está construido con **Next.js** y utiliza una arquitectura modular, facilitando la escalabilidad y el mantenimiento. Incluye autenticación, panel de administración, gestión de clientes, horarios por profesional, y una interfaz intuitiva y responsiva.

El frontend se conecta a una API protegida mediante token, y está preparado para integrarse con sistemas de notificaciones y recordatorios. El flujo de desarrollo y despliegue está optimizado para entornos modernos y utiliza **pnpm** como gestor de paquetes para mayor rapidez y eficiencia.

---

## 🚀 Características principales

- Registro y autenticación de usuarios (Auth.js / NextAuth)
- Panel de administración para gestionar citas, clientes y servicios
- Gestión de clientes/pacientes y profesionales
- Horarios disponibles por día y profesional
- Integración con API protegida por token
- Interfaz moderna, rápida y responsive (Tailwind CSS)
- Preparado para notificaciones y recordatorios (futuro)

---

## 🛠️ Tecnologías Utilizadas

- [Next.js](https://nextjs.org/) – Framework React para SSR y SSG
- [Tailwind CSS](https://tailwindcss.com/) – Estilos rápidos y responsivos
- [React Hook Form](https://react-hook-form.com/) – Manejo de formularios
- [Zod](https://zod.dev/) – Validación de datos
- [PostgreSQL](https://www.postgresql.org/) – Base de datos relacional
- [Auth.js (NextAuth)](https://authjs.dev/) – Autenticación segura
- [Vercel](https://vercel.com/) – Hosting y despliegue
- [pnpm](https://pnpm.io/) – Gestor de paquetes rápido y eficiente

---

## ⚡ Instalación y uso rápido

1. Clona el repositorio y entra en la carpeta del proyecto:
   ```bash
   git clone <url-del-repo>
   cd appointments-frontend
   ```
2. Instala las dependencias con pnpm:
   ```bash
   pnpm install
   ```
3. Crea un archivo `.env` en la raíz del proyecto (ver ejemplo abajo).
4. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

---

## 📄 Ejemplo de archivo `.env`

Configura las variables de entorno necesarias para conectar con la API y autenticar las peticiones:

```env
# URL base de la API
API_URL=http://localhost:3000/api
```

---

---

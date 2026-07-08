# 🏥 FARMACIAS_CONFIG_SUCCESS.MD - FUENTE ÚNICA DE VERDAD

Este documento blinda la configuración técnica del módulo de Farmacias en el proyecto Dr. Goyo. Cualquier modificación futura por parte de desarrolladores o IAs **debe** validar su cumplimiento con este esquema para evitar regresiones críticas.

---

## 1. 🗄️ ESQUEMA DE BASE DE DATOS (VERDAD ABSOLUTA)

La persistencia de datos se divide en dos capas: **Profile** (datos de usuario) y **Pharmacy** (datos específicos del negocio).

### Tabla Principal: `Pharmacy`

| Columna         | Tipo de Dato  | Propósito                                         | Mapping Prisma         |
| :-------------- | :------------ | :------------------------------------------------ | :--------------------- |
| `id`            | `text` (UUID) | Identificador único de la farmacia.               | `id`                   |
| `profile_id`    | `text` (FK)   | Relación 1:1 con la tabla `Profile`.              | `profileId`            |
| `business_name` | `text`        | Nombre comercial de la farmacia.                  | `businessName`         |
| `phone`         | `text`        | Teléfono de contacto directo.                     | `phone`                |
| `image_url`     | `text`        | URL de la foto de perfil/logo (Supabase Storage). | `imageUrl`             |
| `address`       | `text`        | Dirección física detallada.                       | `address`              |
| `city`          | `text`        | Ciudad de operación.                              | `city`                 |
| `openingHours`  | `text`        | Horario de apertura (CamelCase en DB).            | `@map("openingHours")` |
| `closingHours`  | `text`        | Horario de cierre (CamelCase en DB).              | `@map("closingHours")` |
| `hasDelivery`   | `boolean`     | Indica si ofrece servicio a domicilio.            | `@map("hasDelivery")`  |
| `status`        | `text`        | Estado: `PENDING` \| `VERIFIED` \| `REJECTED`.    | `status`               |
| `description`   | `text`        | Breve reseña de la farmacia.                      | `description`          |

### Tabla de Soporte: `Profile`

- **Nombre exacto:** `Profile`.
- **Columna Crítica:** `phone` y `image_url`. Estos campos deben estar sincronizados con la tabla `Pharmacy` para permitir búsquedas globales eficientes.

> [!CAUTION]
> **REGLA DE ORO:** NUNCA intentar guardar o leer datos de farmacias desde la tabla `Patient`. La tabla `Patient` es exclusiva para perfiles de tipo 'Paciente'. Ignorar esto causará un error RLS 42501.

---

## 2. 🔙 LÓGICA DE BACKEND Y API (FLUJOS VALIDADOS)

### Proceso de Actualización (`authController.ts`)

- **Endpoint:** `PUT /api/users/update-profile`.
- **Operación Relevante:** Se utiliza el método `upsert` para la tabla `Pharmacy`.
  - **Razón:** Si por algún error de registro el perfil de farmacia no existe en la tabla específica, el sistema lo crea en lugar de fallar con un error 500.
- **Seguridad:** El `profileId` se extrae del token JWT validado (`req.user.id`). Nunca se debe confiar en un ID enviado en el cuerpo de la petición.

### Subida de Imágenes (`AvatarUploader.tsx`)

- **Bucket:** `profiles`.
- **Estructura de Ruta:** `avatars/${userId}-${timestamp}.jpg`.
- **Pre-validación de Sesión:** Antes de subir a Storage, es obligatorio sincronizar la sesión de Supabase con el token de `localStorage` para evitar el error `AUTH_SESSION_EXPIRED`.

---

## 3. 🎨 FRONTEND: DASHBOARD DE FARMACIA (`PharmacyDashboardScreen.tsx`)

### Sincronización de Formulario

El formulario debe inicializarse mediante `initEditForm` capturando datos de tres fuentes en orden de prioridad para evitar "pérdida de información" por desincronización:

1. `prof.pharmacy` (Datos específicos del negocio).
2. `prof.phone` (Dato espejo en el perfil).
3. `prof.patient.phone` (Solo como fallback histórico).

### Payload de Guardado

El frontend envía un objeto plano al backend que incluye tanto `name` como `businessName` para asegurar compatibilidad con diferentes versiones del API:

```typescript
{
  name: editForm.name,
  businessName: editForm.name,
  imageUrl: editForm.imageUrl,
  phone: editForm.phone,
  // ...otros campos...
}
```

---

## 4. 📱 FRONTEND: VISTA DEL PACIENTE (PÚBLICA)

- **Búsqueda:** Utiliza la tabla `Pharmacy` como fuente primaria para mostrar el nombre (`business_name`), logo (`image_url`) y estado de `hasDelivery`.
- **Actualización en Tiempo Real:** Al guardar en el Dashboard, se dispara un evento global `pharmacyProfileUpdated` que obliga a los componentes visibles a refrescar sus datos de Supabase sin recargar la página.
- **Seguridad del Paciente (OMS):** En los perfiles de farmacia, debe mostrarse el banner de advertencia: _"Recuerda: No Te Automediques. Siempre consulta a un profesional de la salud."_

---

## 5. 🚫 LECCIONES APRENDIDAS Y ERRORES PROHIBIDOS

1.  **Error 42501 (RLS):** Ocurría porque el frontend intentaba actualizar el teléfono en la tabla `Patient`. **Solución:** Direccionar todas las escrituras a `Pharmacy` y `Profile`.
2.  **Error (not available) en Prisma:** Ocurría por discrepancia de nombres entre CamelCase en DB (`openingHours`) y minúsculas en el código. **Solución:** Usar `@map("openingHours")` en el archivo `schema.prisma`.
3.  **Sesión Expirada en Storage:** Ocurría porque el cliente de Supabase perdía el token entre renders. **Solución:** Ejecutar `supabase.auth.setSession` antes de cualquier interacción con el bucket.
4.  **Borrado de Datos Accidental:** Ocurría porque el formulario se inicializaba vacío al no encontrar los campos en snake_case. **Solución:** Soporte dual para `business_name` y `businessName`.

---

## 📂 ARCHIVOS CLAVE DEL PROYECTO

1.  `screens/PharmacyDashboardScreen.tsx`: Lógica principal de gestión de farmacia.
2.  `backend/src/controllers/authController.ts`: Procesamiento de datos y lógica Prisma.
3.  `backend/prisma/schema.prisma`: Definición estructural del sistema.
4.  `components/AvatarUploader.tsx`: Gestión de subida de logos/fotos.
5.  `supabase.ts`: Configuración del cliente y helper `syncSupabaseSession`.

---

_Documentación generada el 02 de Marzo de 2026. Prioridad: CRÍTICA._

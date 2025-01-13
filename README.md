# Foro Web - Frontend

Este proyecto es la interfaz de usuario del **Foro Web**, desarrollada en **Angular**, que consume los endpoints proporcionados por el backend desarrollado en **Spring Boot**. Proporciona funcionalidades como autenticación, gestión de publicaciones, edición de perfiles y más.

## Tecnologías Utilizadas

- **Angular 15**
- **TypeScript**
- **Angular Material** para componentes visuales
- **RxJS** para manejo de flujos reactivos
- **Angular Router** para navegación
- **SCSS** para estilos personalizados

## Características Principales

1. **Autenticación**: Inicio de sesión y protección de rutas con guardas.
2. **Gestión de publicaciones**: Crear, editar, y ver publicaciones detalladas.
3. **Edición de perfil**: Actualización de datos del usuario.
4. **Menú responsivo**: Menú para navegación entre funcionalidades.
5. **Consumo de APIs**: Integración con el backend para manejar usuarios, publicaciones, materias y departamentos.

## Estructura del Proyecto

El proyecto sigue una arquitectura modular para facilitar la escalabilidad:

### Core Components
- **App Module**: Módulo raíz.
- **Routing Module**: Configuración de rutas de la aplicación.

### Feature Components
- **Login Component**: Página de inicio de sesión.
- **Dashboard Component**: Panel principal de la aplicación.
- **Post Form Component**: Formulario para crear publicaciones.
- **Menu Component**: Menú de navegación.
- **Post Detail Component**: Vista detallada de una publicación.
- **Edit Profile Component**: Página de edición del perfil de usuario.

### Services
- **Auth Service**: Gestión de autenticación y autorización.
- **User Service**: Gestión de usuarios.
- **Post Service**: Gestión de publicaciones.

### Models
- **User Model**: Representación de datos de usuario.
- **Post Model**: Representación de datos de publicaciones.
- **Materias Model**: Representación de materias.
- **Departamentos Model**: Representación de departamentos.

## Requisitos Previos

1. **Node.js** (v16 o superior).
2. **Angular CLI** (v15 o superior).
3. Backend del Foro Web (API disponible en `http://localhost:8080`).

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd frontend-foro
   ```
###  Instala las dependencias:
   ```bash
npm install
   ```
### Configura los endpoints del backend en el archivo environment.ts 
   ```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
   ```
## Ejecución
1. Inicia la aplicación en modo desarrollo:
   ```bash
   ng serve
      ```

2. Abre tu navegador en http://localhost:4200.
### Endpoints Consumidos
1. Usuarios

    1.1. POST /api/usuarios/login: Iniciar sesión.
    1.2. GET /api/usuarios/token: Obtener información del usuario autenticado.

2. Publicaciones

   2.1. POST /api/post/post: Crear publicación.
   2.2. GET /api/post/{id}: Ver detalles de una publicación.
   2.3. DELETE /api/post/{id}: Eliminar publicación.

3. Materias

    3.1. GET /api/materias: Obtener lista de materias.

4. Departamentos

    4.1. GET /api/departamentos: Obtener lista de departamentos.

# Backend
https://github.com/edgar1223/foroWEBCOmplleto.git




   



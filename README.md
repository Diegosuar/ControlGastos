# 💰 Control de Gastos e Ingresos

Una aplicación moderna y completa para gestionar tus finanzas personales. Disponible en dos versiones: HTML/CSS/JS vanilla y React.

## 🚀 Características

- ✅ **Registro completo de ingresos y gastos**
- ✅ **Categorías predefinidas organizadas**
- ✅ **Filtros avanzados por mes, año y tipo**
- ✅ **Cálculos automáticos y resumen financiero**
- ✅ **Exportación de datos a CSV**
- ✅ **Interfaz moderna y responsive**
- ✅ **Persistencia de datos (localStorage)**
- ✅ **Funciones de edición y eliminación**

## 📁 Estructura del Proyecto

```
expense-tracker/
│
├── 📂 html-version/          # Versión HTML/CSS/JS
│   ├── index.html           # Página principal
│   ├── styles.css           # Estilos CSS
│   └── script.js            # Lógica JavaScript
│
├── 📂 react-version/         # Versión React
│   ├── src/
│   │   ├── ExpenseTracker.jsx
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── package.json             # Configuración del proyecto
└── README.md               # Este archivo
```

## 🔧 Instalación y Uso

### Versión HTML/CSS/JS (Recomendada para uso simple)

1. **Descarga los archivos:**
   - `index.html`
   - `styles.css`
   - `script.js`

2. **Coloca todos los archivos en la misma carpeta**

3. **Abre `index.html` en tu navegador**
   - Doble clic en el archivo
   - O arrastra el archivo al navegador
   - ¡Listo! La aplicación funcionará inmediatamente

### Versión React (Para desarrollo avanzado)

1. **Instala Node.js** (si no lo tienes)
   - Descarga desde: https://nodejs.org/

2. **Crea un nuevo proyecto React:**
   ```bash
   npx create-react-app expense-tracker-app
   cd expense-tracker-app
   ```

3. **Reemplaza el contenido de `src/App.js`** con el código de `ExpenseTracker.jsx`

4. **Instala Tailwind CSS:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

5. **Configura Tailwind** agregando esto a `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. **Ejecuta la aplicación:**
   ```bash
   npm start
   ```

## 💡 Cómo Usar la Aplicación

### 1. **Configuración Inicial**
- Selecciona el mes y año actual en la parte superior
- Los totales se calculan automáticamente para el período seleccionado

### 2. **Agregar Movimientos**
- Completa todos los campos del formulario
- Selecciona el tipo (Ingreso o Gasto)
- Elige una categoría apropiada
- Agrega una descripción clara
- Ingresa el monto

### 3. **Gestionar Transacciones**
- **Ver:** Todas las transacciones aparecen en la tabla
- **Filtrar:** Usa los filtros por mes, año o tipo
- **Editar:** Haz clic en "Editar" para modificar una transacción
- **Eliminar:** Haz clic en "Eliminar" para borrar una transacción

### 4. **Análisis Financiero**
- **Resumen automático:** Ingresos, gastos y balance del mes
- **Filtros avanzados:** Analiza períodos específicos
- **Exportación:** Descarga tus datos en formato CSV

## 📊 Categorías Incluidas

### 💚 Ingresos
- Salario
- Freelance
- Bonos
- Inversiones
- Ventas
- Alquiler
- Intereses
- Regalos
- Otros Ingresos

### 💸 Gastos
- Alimentación
- Transporte
- Vivienda
- Servicios
- Salud
- Educación
- Entretenimiento
- Ropa
- Tecnología
- Seguros
- Impuestos
- Otros Gastos

## 🛠️ Funciones Avanzadas

### Persistencia de Datos
- Los datos se guardan automáticamente en tu navegador
- No necesitas crear cuentas ni conectarte a internet
- Tus datos permanecen privados en tu dispositivo

### Exportación CSV
- Descarga todos tus datos en formato Excel
- Compatible con Google Sheets, Excel, Numbers
- Perfecto para análisis más profundos

### Responsive Design
- Funciona perfectamente en computadoras
- Optimizado para tablets y móviles
- Interfaz adaptable a cualquier pantalla

## 🎨 Tecnologías Utilizadas

### Versión HTML
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript ES6+**: Funcionalidad completa
- **LocalStorage**: Persistencia de datos

### Versión React
- **React 18**: Framework moderno
- **Tailwind CSS**: Estilos utilitarios
- **Hooks**: useState, useEffect
- **JavaScript ES6+**: Sintaxis moderna

## 🔒 Privacidad y Seguridad

- ✅ **100% Local**: Todos los datos se almacenan en tu dispositivo
- ✅ **Sin servidores**: No enviamos datos a terceros
- ✅ **Sin registros**: No necesitas crear cuentas
- ✅ **Código abierto**: Puedes revisar todo el código

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

**❓ No se guardan mis datos**
- Asegúrate de que las cookies estén habilitadas
- No uses modo incógnito del navegador

**❓ La aplicación se ve mal**
- Verifica que todos los archivos estén en la misma carpeta
- Actualiza tu navegador a la versión más reciente

**❓ No puedo exportar CSV**
- Algunos navegadores bloquean descargas automáticas
- Permite las descargas en la configuración del navegador

### Navegadores Compatibles
- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (funcionalidad limitada)

## 🚀 Próximas Funciones (Roadmap)

- 📊 **Gráficos y reportes visuales**
- 📱 **Aplicación móvil nativa**
- 💾 **Sincronización en la nube (opcional)**
- 🎯 **Metas y presupuestos**
- 📈 **Análisis de tendencias**
- 🔔 **Recordatorios y notificaciones**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usar, modificar y distribuir libremente.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación:

1. Haz un fork del proyecto
2. Crea una rama para tu función
3. Realiza los cambios
4. Envía un pull request

## 📞 Contacto

¿Tienes preguntas o sugerencias? 
- 📧 Email: [diego.suarezob@gmail.com]
---

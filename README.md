<p align="center">
  <img src="https://i.imgur.com/4Tppt0F.jpeg" alt="IA Voice Marketplace Logo" />
</p>

# 🛒 Buy n Large Voice Agent MVP  
## Proyecto: IA VOICE Marketplace

---

## 📌 Introducción

**IA VOICE Marketplace** es un proyecto de tipo **Marketplace de productos tecnológicos**, cuya principal innovación es la integración de un **asistente de voz inteligente**. A diferencia de las tiendas tradicionales, este asistente te recomienda productos de nuestro inventario según tus necesidades, resuelve tus dudas y te guía durante todo el proceso de compra, proporcionando una experiencia conversacional única.

---

## 🧩 Desarrollo

### 🖼️ Frontend

El diseño del frontend fue realizado con **Lovable**, solicitando un estilo **moderno, sobrio, con buenas prácticas de UX/UI**, utilizando tonos frescos y una interfaz intuitiva. Las tecnologías empleadas fueron:

- **React**
- **Vite**
- **Tailwind CSS**

### 🧠 Backend

Para el backend se utilizó **Python**, encargado de conectar y gestionar el SDK de **Gemini Live**.  
El código fue cuidadosamente comentado para facilitar su comprensión, siguiendo principios de limpieza y evitando la duplicación innecesaria.

---

## 🚧 Retos y bloqueos

Desde el inicio supe que esta prueba sería un gran reto, ya que **no estaba familiarizado con varias de las herramientas** requeridas. Aprendí a través del ensayo y error, y aquí comparto algunos de los principales bloqueos:

### 1. Créditos limitados en Lovable

Al intentar crear una versión robusta del Marketplace (con carrito, login de administrador y panel de parametrización), no contaba con que **la cuenta gratuita de Lovable solo permite 5 consultas diarias**. Esto me obligó a crear una segunda cuenta, perdiendo todo el trabajo inicial. Aunque fue frustrante, logré reconstruir una versión más simple y efectiva.

### 2. Errores con el SDK de Gemini

La integración con **Gemini Live** fue complicada. La consola arrojaba errores de "saldo insuficiente", incluso después de registrar una tarjeta para ampliar la cuota gratuita. Aunque logré implementar parcialmente el SDK, **el WebSocket dejó de responder**, bloqueando el flujo de conversación.

### 3. Fallo al integrar la API de OpenAI

Intenté usar la **API de OpenAI** para que el asistente tuviera respuestas más naturales y actualizadas, pero esto provocó múltiples errores y conflictos en el código. Por esta razón, decidí **posponer su integración hasta solucionar por completo la conexión con Gemini Live**.

---

## 📚 Lo aprendido

Después de las dificultades vinieron los aprendizajes:

- Esta prueba fue **muy entretenida y enriquecedora**. Aunque hubo frustraciones, disfruté el proceso y me motivó a seguir aprendiendo sobre IA.
- Me sorprendió el **potencial de las herramientas de inteligencia artificial** y su aplicación práctica en soluciones reales.
- Este proyecto me hizo valorar la importancia de la planificación, el control de versiones y las pruebas continuas.

---

## ⚙️ ¿Cómo ejecutar la aplicación en tu entorno local?

> Si deseas trabajar localmente con tu propio editor de código (IDE), puedes clonar el repositorio y realizar cambios. Estos cambios también se reflejarán en Lovable.  
> Solo necesitas tener **Node.js** y **npm** instalados. Puedes usar [nvm para instalarlo](https://github.com/nvm-sh/nvm#installing-and-updating).

### 🔧 Ambiente Frontend

#### Pasos:

```bash
# Paso 1: Clona el repositorio desde la URL del proyecto
git clone <TU_URL_DEL_REPOSITORIO>

# Paso 2: Entra en la carpeta del proyecto
cd <NOMBRE_DEL_PROYECTO>

# Paso 3: Instala las dependencias necesarias
npm install

# Paso 4: Ejecuta el servidor de desarrollo
npm run dev
```

### 🔌 Ambiente Backend

#### Pasos:

```bash
# Instala las dependencias del proyecto
pip install -r requirements.txt

# Instala el SDK de Gemini Live junto con websockets y pydub
pip install git+https://github.com/googleapis/python-genai.git websockets pydub
```

🙌 ¡Gracias por leer!
Si tienes alguna duda o deseas colaborar, no dudes en contactarme.
Este fue un proyecto desafiante, pero lleno de aprendizajes y ganas de seguir explorando el mundo de la inteligencia artificial aplicada y poder tener una oportunidad de estar en un equipo como **FAIL FAST** 🚀.
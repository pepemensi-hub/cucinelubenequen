# Cucine LUBE Neuquén — Sitio web

Sitio estático (HTML + CSS + JS, sin dependencias) del showroom oficial Cucine LUBE Neuquén, con la línea visual de cucinelube.it.

## Correr en local
```
npm start
```
Abrir http://localhost:5500

## Configurar
- `js/config.js` → número de WhatsApp (+54 9 299 326-8860), dirección, firma de mensajes.
- `js/asistente.js` → preguntas frecuentes del asistente (array `FAQ`).

## Todo deriva a WhatsApp
- Asistente flotante: responde FAQs y cada respuesta tiene botón "Seguir por WhatsApp" con la consulta precargada.
- Formulario de contacto, botones "Consultar" de cada cocina y la guía de compra abren WhatsApp con mensaje listo.

## Publicar
Compatible con GitHub Pages / Netlify / Vercel tal cual (no requiere build).

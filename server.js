// server.js
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// IDs de grupos
const PING_GROUP_ID = "120363420067500052@g.us";       // Grupo para pings
const MAIN_GROUP_ID = "120363402893232009@g.us";       // Grupo para mensajes normales

app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea este código QR con tu WhatsApp para iniciar sesión');
});

client.on('ready', async () => {
  console.log('✅ Cliente WhatsApp listo!');

  const chats = await client.getChats();
  const grupos = chats.filter(chat => chat.isGroup);

  console.log('--- Grupos encontrados ---');
  grupos.forEach(grupo => {
    console.log(`${grupo.name} — ID: ${grupo.id._serialized}`);
  });
});

client.initialize();

// Ruta ping para keep-alive que manda mensaje al grupo de pings
app.get('/ping', async (req, res) => {
  try {
    await client.sendMessage(PING_GROUP_ID, '🤖 Bot activo, haciendo ping');
    res.send('pong');
  } catch (err) {
    console.error('Error enviando mensaje en ping:', err);
    res.status(500).send('Error');
  }
});

// Endpoint para enviar mensajes al grupo principal
app.post('/send-message', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Falta el mensaje' });
    }
    await client.sendMessage(MAIN_GROUP_ID, message);
    res.json({ success: true, message: 'Mensaje enviado al grupo' });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ error: 'Error enviando mensaje' });
  }
});

app.post('/send-task', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Falta el mensaje' });
    }
    await client.sendMessage(MAIN_GROUP_ID, message);
    res.json({ success: true, message: 'Mensaje enviado al grupo' });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ error: 'Error enviando mensaje' });
  }
});

app.post('/enviar-mensaje', async (req, res) => {
  try {
    const { mensaje } = req.body;
    if (!mensaje) {
      return res.status(400).send('Falta el mensaje');
    }
    await client.sendMessage(MAIN_GROUP_ID, mensaje);
    res.send('✅ Mensaje enviado al grupo fijo');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al enviar el mensaje');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


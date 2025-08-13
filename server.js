// server.js
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// ID del grupo
const GROUP_ID = "120363402893232009@g.us";

app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea este código QR con tu WhatsApp para iniciar sesión');
});

client.on('ready', () => {
    console.log('✅ Cliente WhatsApp listo!');
});

client.initialize();

// Endpoint único para enviar cualquier mensaje al grupo
app.post('/send-message', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Falta el mensaje' });
        }

        await client.sendMessage(GROUP_ID, message);
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
        await client.sendMessage(GROUP_ID, message);
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
    await client.sendMessage(GROUP_ID, mensaje);
    res.send('✅ Mensaje enviado al grupo fijo');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al enviar el mensaje');
  }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

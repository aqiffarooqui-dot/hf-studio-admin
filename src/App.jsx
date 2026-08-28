const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const cors = require('cors');
const pino = require('pino');
const readline = require('readline');

const app = express();
app.use(express.json());
app.use(cors());

let sock;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  
  sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  if (!sock.authState.creds.registered) {
    const phoneNumber = await askQuestion('\n📱 Enter your WhatsApp Phone Number (e.g. 919997210876): ');
    console.log(`\n⏳ Generating pairing code for ${phoneNumber}...\n`);
    
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(phoneNumber.trim());
        console.log(`\n✨ YOUR WHATSAPP PAIRING CODE IS: 👉  ${code}  👈\n`);
      } catch (err) {
        console.error('Pairing code error:', err);
      }
    }, 4000);
  }

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log('\n✅ WhatsApp Background Gateway Connected Successfully!\n');
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startWhatsApp();
    }
  });
}

startWhatsApp();

// Admin App se jo request aayegi, yeh use WhatsApp par bhej dega
app.post('/api/send-message', async (req, res) => {
  const { phone, message } = req.body;
  try {
    if (!sock) return res.status(500).json({ error: 'Socket not ready' });
    const cleanPhone = String(phone).replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: message });
    res.json({ success: true, message: 'Sent via Baileys background gateway!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/broadcast', async (req, res) => {
  const { recipients, templateText } = req.body;
  try {
    if (!sock) return res.status(500).json({ error: 'Socket not ready' });
    for (const ph of recipients) {
      const cleanPhone = String(ph).replace(/\D/g, '');
      await sock.sendMessage(`${cleanPhone}@s.whatsapp.net`, { text: templateText });
      await new Promise(r => setTimeout(r, 1200)); // Delay to prevent spam detection
    }
    res.json({ success: true, message: 'Broadcast completed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3005, () => {
  console.log('🚀 Standalone Baileys WA Server running on port 3005');
});

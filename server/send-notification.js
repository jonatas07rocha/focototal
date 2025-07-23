// Carrega as variáveis de ambiente (necessário para o caminho do service account)
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//
// ATENÇÃO: Configure o caminho para o seu arquivo de chave de conta de serviço no .env
// Exemplo no .env: GOOGLE_APPLICATION_CREDENTIALS="./caminho/para/sua-chave.json"
//
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
  console.log("Firebase Admin SDK inicializado com sucesso.");
} catch (error) {
  console.error("ERRO: Falha ao inicializar o Firebase Admin SDK.", error);
  console.log("Verifique se a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS está configurada corretamente no seu arquivo .env e aponta para um arquivo JSON válido.");
  process.exit(1);
}


app.use(bodyParser.json());

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rota para registrar um token de cliente
// (Opcional, mas bom para armazenar tokens em um banco de dados no futuro)
let clientTokens = []; // Armazenamento temporário em memória
app.post('/api/register-token', (req, res) => {
    const { token } = req.body;
    if (token && !clientTokens.includes(token)) {
        clientTokens.push(token);
        console.log('Novo token registrado:', token);
        res.status(200).json({ message: 'Token registrado com sucesso.' });
    } else {
        res.status(400).json({ error: 'Token inválido ou já registrado.' });
    }
});


// Rota para enviar notificações usando o Firebase Admin SDK
app.post('/api/send-notification', async (req, res) => {
    const { token, payload, delay } = req.body; // Agora esperamos 'token' em vez de 'subscription'

    if (!token || !payload) {
        return res.status(400).json({ error: 'O token do dispositivo e o payload são obrigatórios.' });
    }

    const message = {
        notification: {
            title: payload.title,
            body: payload.body,
        },
        token: token, // O token de registro do FCM do cliente
        webpush: { // Configurações específicas para web push
            notification: {
                icon: payload.icon || '/icon-192x192.png'
            }
        }
    };
    
    try {
        // Envia a mensagem. O agendamento (delay) não é suportado diretamente aqui.
        // O agendamento deve ser feito no lado do cliente ou com funções do Cloud Functions.
        // Para este caso, enviaremos imediatamente.
        const response = await admin.messaging().send(message);
        console.log('Notificação enviada com sucesso:', response);
        res.status(200).json({ message: 'Notificação enviada com sucesso!', response });
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        res.status(500).json({ error: 'Falha ao enviar notificação.', details: error.message });
    }
});

// Rota catch-all para servir o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

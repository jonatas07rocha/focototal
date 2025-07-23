require('dotenv').config({ path: '../.env' }); // Carrega as variáveis de ambiente do .env

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use a porta que for adequada para seu servidor

// Configurar o body-parser para JSON
app.use(bodyParser.json());

// Configurar chaves VAPID
webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Rota para enviar notificações
// Esta é a rota que seu frontend irá chamar
app.post('/api/send-notification', async (req, res) => {
    const { subscription, payload, delay } = req.body;

    if (!subscription || !payload) {
        return res.status(400).json({ error: 'Subscription and payload are required.' });
    }

    const options = {
        TTL: delay || 60 // Tempo de vida da notificação em segundos. Padrão 60s, mas pode ser o delay do timer
    };

    try {
        // Envia a notificação
        await webpush.sendNotification(subscription, JSON.stringify(payload), options);
        res.status(200).json({ message: 'Notification sent successfully!' });
    } catch (error) {
        console.error('Error sending notification:', error);
        if (error.statusCode === 410) { // GONE - Inscrição expirada/inválida
            // Aqui você deve remover a inscrição inválida do seu banco de dados
            console.warn('Subscription is no longer valid:', subscription);
            res.status(410).json({ error: 'Subscription no longer valid.' });
        } else {
            res.status(500).json({ error: 'Failed to send notification.', details: error.message });
        }
    }
});

// Opcional: Servir arquivos estáticos da pasta public
// Se você estiver usando este mesmo servidor para servir o frontend,
// descomente as linhas abaixo.
// app.use(express.static(path.join(__dirname, '../public')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('VAPID Public Key:', process.env.VAPID_PUBLIC_KEY);
});

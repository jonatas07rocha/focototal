// /api/subscribe.js
const webpush = require('web-push');

// 1. Validação Imediata das Chaves VAPID
// Se alguma chave estiver em falta, o servidor irá falhar com uma mensagem clara.
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
  console.error("ERRO CRÍTICO: Uma ou mais chaves VAPID não estão definidas no ambiente da Vercel.");
  // Não continuar se as chaves não estiverem presentes.
} else {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export default async function handler(req, res) {
  // Verifica se as chaves foram carregadas antes de prosseguir
  if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
    return res.status(500).json({ success: false, message: "Erro de configuração do servidor: Chaves VAPID em falta." });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { subscription, delay, message, title } = req.body;

    if (!subscription || !delay || !message || !title) {
        return res.status(400).json({ success: false, message: 'Dados insuficientes na requisição.' });
    }

    setTimeout(() => {
        const payload = JSON.stringify({ title, body: message });
        
        webpush.sendNotification(subscription, payload)
            .catch(error => {
                console.error(`Erro ao enviar notificação agendada para ${subscription.endpoint}:`, error);
            });
    }, delay * 1000);

    res.status(202).json({ success: true, message: 'Notificação agendada.' });

  } catch (error) {
    console.error('Erro no handler de /api/subscribe:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
}

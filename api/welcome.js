// /api/welcome.js
const webpush = require('web-push');

// 1. Validação Imediata das Chaves VAPID (idêntica ao subscribe.js)
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
  console.error("ERRO CRÍTICO: Uma ou mais chaves VAPID não estão definidas no ambiente da Vercel.");
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
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({ success: false, message: 'Inscrição (subscription) não fornecida.' });
    }

    const payload = JSON.stringify({
      title: 'Foco Total Ativado! 🚀',
      body: 'Tudo pronto! As suas notificações foram configuradas com sucesso.',
    });

    // Envio imediato da notificação de boas-vindas
    await webpush.sendNotification(subscription, payload);

    res.status(200).json({ success: true, message: 'Notificação de boas-vindas enviada.' });

  } catch (error) {
    console.error('Erro no handler de /api/welcome:', error);
    // Retorna o erro específico do web-push para o cliente, o que ajuda na depuração
    res.status(500).json({ success: false, message: `Erro ao enviar notificação: ${error.message}` });
  }
}

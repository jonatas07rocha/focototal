// /api/welcome.js

// Importa a biblioteca para enviar notificações push.
const webpush = require('web-push');

// Tenta configurar as chaves VAPID a partir das variáveis de ambiente.
try {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} catch (error) {
    console.error("VAPID keys não configuradas no ambiente. As notificações não funcionarão.", error);
}

// Handler da função serverless
export default async function handler(req, res) {
  // Aceita apenas requisições POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Extrai apenas a inscrição do corpo da requisição
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({ success: false, message: 'Inscrição (subscription) não fornecida.' });
    }

    // Prepara a notificação de boas-vindas
    const payload = JSON.stringify({
      title: 'Foco Total Ativado! 🚀',
      body: 'Tudo pronto! Suas notificações foram configuradas com sucesso.',
    });

    // Envia a notificação IMEDIATAMENTE (sem delay)
    await webpush.sendNotification(subscription, payload);

    // Responde com sucesso
    res.status(200).json({ success: true, message: 'Notificação de boas-vindas enviada.' });

  } catch (error) {
    console.error('Erro no endpoint /api/welcome:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
}

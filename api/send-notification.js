// /api/send-notification.js
const webpush = require('web-push');

export default async function handler(req, res) {
  // Log para indicar que a função foi chamada
  console.log('Endpoint /api/send-notification foi acionado.');

  if (req.method !== 'POST') {
    console.log('Método não permitido:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Extrai as chaves VAPID do ambiente.
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT;

    // Log para verificar se as chaves foram lidas do ambiente.
    console.log('Chave Pública lida:', vapidPublicKey ? 'Sim' : 'Não');
    console.log('Chave Privada lida:', vapidPrivateKey ? 'Sim' : 'Não');
    console.log('Subject lido:', vapidSubject ? 'Sim' : 'Não');

    // Validação crítica: se alguma chave estiver faltando, a função para aqui.
    if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
      console.error("ERRO CRÍTICO: Uma ou mais chaves VAPID não estão definidas no ambiente.");
      return res.status(500).json({ message: "Erro de configuração do servidor: chaves VAPID ausentes." });
    }

    // Configura o web-push com as chaves a cada chamada.
    // Isso é mais robusto em ambientes serverless.
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const { subscription, payload } = req.body;

    if (!subscription || !payload) {
      console.log('Requisição inválida: subscription ou payload ausente.');
      return res.status(400).json({ message: 'Dados insuficientes na requisição.' });
    }
    
    console.log('Enviando notificação para a inscrição...');
    
    // Envia a notificação
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    
    console.log('Notificação enviada com sucesso.');
    res.status(200).json({ success: true, message: 'Notificação enviada.' });

  } catch (error) {
    // Log detalhado do erro no backend.
    console.error('Erro detalhado no endpoint /api/send-notification:', error);
    
    // Retorna uma mensagem de erro mais informativa para o frontend.
    res.status(500).json({ 
      success: false, 
      message: `Erro ao enviar notificação: ${error.message}`,
      statusCode: error.statusCode || 500 // Inclui o status code do erro, se houver.
    });
  }
}

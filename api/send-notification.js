// api/send-notification.js
const webpush = require('web-push');

// Validação imediata das chaves VAPID
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

// Se alguma chave estiver em falta, o servidor irá falhar com uma mensagem clara.
if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
  console.error("ERRO CRÍTICO: Uma ou mais chaves VAPID não estão definidas no ambiente da Vercel.");
  // Lançar um erro impede que a função seja executada incorretamente.
  throw new Error("As variáveis de ambiente VAPID não estão configuradas corretamente.");
}

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { subscription, payload, delay } = req.body;

    // Validação dos dados recebidos
    if (!subscription || !payload) {
      return res.status(400).json({ message: 'Dados insuficientes na requisição (inscrição ou payload em falta).' });
    }

    // Se houver um delay, agenda a notificação. Caso contrário, envia imediatamente.
    if (delay && delay > 0) {
        setTimeout(() => {
            webpush.sendNotification(subscription, JSON.stringify(payload))
                .catch(error => console.error(`Erro ao enviar notificação agendada:`, error));
        }, delay * 1000); // Converte segundos para milissegundos
        
        res.status(202).json({ success: true, message: 'Notificação agendada.' });

    } else {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        res.status(200).json({ success: true, message: 'Notificação enviada imediatamente.' });
    }

  } catch (error) {
    console.error('Erro no endpoint /api/send-notification:', error);
    res.status(500).json({ success: false, message: `Erro ao enviar notificação: ${error.message}` });
  }
}

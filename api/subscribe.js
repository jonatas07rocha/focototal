// Importa a biblioteca para enviar notificações push.
const webpush = require('web-push');

// Configura o web-push com as chaves VAPID que você salvou na Vercel.
// Ele busca as variáveis de ambiente automaticamente.
try {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} catch (error) {
    console.error("VAPID keys não configuradas no ambiente. As notificações não funcionarão.", error);
}


// Esta é a função principal que a Vercel irá executar.
export default async function handler(req, res) {
  // 1. Aceita apenas requisições do tipo POST.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 2. Extrai os dados enviados pelo frontend (index.html).
    const { subscription, delay, message, title } = req.body;

    // 3. Validação simples para garantir que todos os dados necessários foram recebidos.
    if (!subscription || !delay || !message || !title) {
        return res.status(400).json({ success: false, message: 'Dados insuficientes na requisição.' });
    }

    // 4. Agenda o envio da notificação.
    // O setTimeout aguarda o tempo de 'delay' (em milissegundos) antes de executar.
    setTimeout(() => {
        const payload = JSON.stringify({
            title: title,
            body: message,
        });

        // 5. Envia a notificação para o usuário.
        webpush.sendNotification(subscription, payload)
            .catch(error => {
                // O erro '410 Gone' significa que a inscrição do usuário não é mais válida.
                console.error('Erro ao enviar notificação push:', error);
            });
    }, delay * 1000); // Converte o delay de segundos para milissegundos

    // 6. Responde imediatamente ao frontend, confirmando que a notificação foi agendada.
    res.status(202).json({ success: true, message: 'Notificação agendada.' });

  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
}

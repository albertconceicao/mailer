import { nodemailerClient } from '../clients/nodemailerClient';

export async function handler(event:any) {
  // Decodifica o corpo da requisição, se estiver em Base64
  let body;
  try {
    const decodedBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : event.body;
    body = JSON.parse(decodedBody);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Erro ao processar o corpo da requisição' }),
    };
  }

  const fileData = body?.file;
  if (!fileData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Arquivo não encontrado na requisição' }),
    };
  }

  // Extrai as informações do arquivo
  const { filename, content } = fileData;
  const buffer = Buffer.from(content, 'base64');

  // Envia o email com o anexo
  await nodemailerClient.sendMail({
    from: 'Sandy Carvalho <contato@sandycarvalho.com.br>',
    replyTo: ['contato@sandycarvalho.com.br', 'agendamento@sandycarvalho.com.br'],
    to: 'contato@albertconceicao.dev.br',
    subject: 'Você foi cadastrado na clínica virtual da Psicóloga Sandy Carvalho',
    text: 'Estamos felizes de ter você conosco, que sua jornada de autoconhecimento seja maravilhosa',
    html: '<h1>Olá, tudo bem?</h1><p>Estamos felizes de ter você conosco, que sua <strong>jornada de autoconhecimento</strong> seja maravilhosa</p>',
    attachments: [
      {
        filename: filename,
        content: buffer,
      }
    ]
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Email enviado com sucesso!' }),
  };
}

import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from '../clients/sesClient';

export async function handler() {
  const sendEmailCommand = new SendEmailCommand({
    Source: 'contato@sandycarvalho.com.br',
    ReplyToAddresses: ['contato@sandycarvalho.com.br'],
    Destination: {
      ToAddresses: ['contato@albertconceicao.dev.br'],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Você foi cadastrado na clínica virtual da Psicóloga Sandy Carvalho',
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: 'Estamos felizes de ter você conosco, que sua jornada de autoconhecimento seja maravilhosa',
        },
        Html: {
          Charset: 'UTF-8',
          Data: '<h1>Olá, tudo bem?</h1><p>Estamos felizes de ter você conosco, que sua <strong>jornada de autoconhecimento</strong> seja maravilhosa</p>',
        }
      },
    },

  });

  await sesClient.send(sendEmailCommand);
  return {
    statusCode: 200,
  };
}

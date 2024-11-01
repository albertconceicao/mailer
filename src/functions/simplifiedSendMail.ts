import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { nodemailerClient } from '../clients/nodemailerClient';
import { s3Client } from '../clients/s3Client';

export async function handler() {
  const getObjectCommand = new GetObjectCommand({
    Bucket: 's3-albert-test',
    Key: 'uploads/25d68627-3d6a-4247-81f4-de0a41af0e66-Alternativa com fundo azul.png',
  });

  const { Body } = await s3Client.send(getObjectCommand);

  if (!(Body instanceof Readable)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'File not found'}),
    };
  }


  await nodemailerClient.sendMail({
    from: 'Sandy Carvalho <contato@sandycarvalho.com.br>',
    replyTo: ['contato@sandycarvalho.com.br, agendamento@sandycarvalho.com.br'],
    to: ['contato@albertconceicao.dev.br', 'developer.albert@outlook.com', 'sannunesc@gmail.com', 'psysandycarvalho@gmail.com'],
    subject: 'Você foi cadastrado na clínica virtual da Psicóloga Sandy Carvalho',
    text: 'Estamos felizes de ter você conosco, que sua jornada de autoconhecimento seja maravilhosa',
    html: '<h1>Olá, tudo bem?</h1><p>Estamos felizes de ter você conosco, que sua <strong>jornada de autoconhecimento</strong> seja maravilhosa</p>',
    attachments: [

      {
        filename: 'uploads/25d68627-3d6a-4247-81f4-de0a41af0e66-Alternativa com fundo azul.png',
        content: Body,
      }
    ]
  });

  return {
    statusCode: 200,
  };
}



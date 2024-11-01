import { GetObjectCommand } from '@aws-sdk/client-s3';
import { SendRawEmailCommand } from '@aws-sdk/client-ses';
import { Readable } from 'node:stream';
import { s3Client } from '../clients/s3Client';
import { sesClient } from '../clients/sesClient';

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

  const chunks = [];

  for await (const chunk of Body) {
    chunks.push(chunk);
  }

  const file = Buffer.concat(chunks).toString('base64');

  const mime = `From: Sandy Carvalho <contato@sandycarvalho.com.br>
To: albertconceicao2@gmail.com
Reply-To: contato@sandycarvalho.com.br, agendamento@sandycarvalho.com.br
Subject: Você foi cadastrado na clínica virtual da Psicóloga Sandy Carvalho
MIME-Version: 1.0
Content-type: multipart/mixed; boundary="MixedBoundary"

--MixedBoundary
Content-type: multipart/alternative; boundary="AlternativeBoundary"

--AlternativeBoundary
Content-Type: text/plain; charset=UTF-8
Estamos felizes de ter você conosco, que sua jornada de autoconhecimento seja maravilhosa

--AlternativeBoundary
Content-Type: text/html; charset=UTF-8
<h1>Olá, tudo bem?</h1><p>Estamos felizes de ter você conosco, que sua <strong>jornada de autoconhecimento</strong> seja maravilhosa</p>

--AlternativeBoundary--

--MixedBoundary
Content-Type: application/octet-stream;
Content-Disposition: attachment; filename="uploads/25d68627-3d6a-4247-81f4-de0a41af0e66-Alternativa com fundo azul.png"
Content-Transfer-Encoding: base64

${file}

--MixedBoundary
Content-Type: application/octet-stream;
Content-Disposition: attachment; filename="uploads/25d68627-3d6a-4247-81f4-de0a41af0e66-Alternativa com fundo azul.png"
Content-Transfer-Encoding: base64

${file}
  `;
  const sendRawEmailCommand = new SendRawEmailCommand({
    RawMessage: {
      Data: Buffer.from(mime),
    }
  });

  await sesClient.send(sendRawEmailCommand);
  return {
    statusCode: 200,
  };
}

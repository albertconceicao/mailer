import { SendRawEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from '../clients/sesClient';

export async function handler() {
  const file = Buffer.from('Conteúdo do arquivo').toString('base64');
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
Content-Disposition: attachment; filename="resumo.txt"
Content-Transfer-Encoding: base64

${file}

--MixedBoundary
Content-Type: application/octet-stream;
Content-Disposition: attachment; filename="resumo2.txt"
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

import parser from "lambda-multipart-parser";
import { nodemailerClient } from '../clients/nodemailerClient';
import { response } from '../utils/response';

export async function handler(event:any) {
  const { files } = await parser.parse(event);
    const [file] = files;

    console.log(file);

    if (!file || file.fieldname !== 'file') {
        return response(400, {
            error: 'Filename is required',
        });
    }

    if (file.contentType !== 'image/png') {
        return response(400, {
            error: 'Only png files are accepted',
        });
    }

  await nodemailerClient.sendMail({
    from: 'Sandy Carvalho <contato@sandycarvalho.com.br>',
    replyTo: ['contato@sandycarvalho.com.br', 'agendamento@sandycarvalho.com.br'],
    to: ['contato@albertconceicao.dev.br', 'developer.albert@outlook.com'],
    subject: 'Você foi cadastrado na clínica virtual da Psicóloga Sandy Carvalho',
    text: 'Estamos felizes de ter você conosco, que sua jornada de autoconhecimento seja maravilhosa',
    html: '<h1>Olá, tudo bem?</h1><p>Estamos felizes de ter você conosco, que sua <strong>jornada de autoconhecimento</strong> seja maravilhosa</p>',
    attachments: [
      {
        filename: file.filename,
        content: file.content,
      }
    ]
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Email enviado com sucesso!' }),
  };
}

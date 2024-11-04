import parser from "lambda-multipart-parser";
import { nodemailerClient } from '../clients/nodemailerClient';
import { response } from '../utils/response';

export async function handler(event:any) {
  const { files, emailToSend } = await parser.parse(event);
    const [file] = files;

    console.log(file);

    if (!file || file.fieldname !== 'file') {
        return response(400, {
            error: 'Filename is required',
        });
    }

    const fileContent = file.contentType.startsWith('image/') || file.contentType === 'application/pdf'
    ? file.content
    : file.content;

  await nodemailerClient.sendMail({
    from: 'Sandy Carvalho <contato@sandycarvalho.com.br>',
    replyTo: ['contato@sandycarvalho.com.br', 'agendamento@sandycarvalho.com.br'],
    to: [emailToSend],
    subject: 'Você foi cadastrado na clínica virtual da Psicóloga Sandy Carvalho',
    text: 'Estamos felizes de ter você conosco, que sua jornada de autoconhecimento seja maravilhosa',
    html: '<h1>Olá, tudo bem?</h1><p>Estamos felizes de ter você conosco, que sua <strong>jornada de autoconhecimento</strong> seja maravilhosa</p>',
    attachments: [
      {
        filename: file.filename,
        content: fileContent,
      }
    ]
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Email enviado com sucesso!' }),
  };
}

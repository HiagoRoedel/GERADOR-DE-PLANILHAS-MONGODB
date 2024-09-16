import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import XLSX from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('development_mkt');  // AQUI VOCÊ DEVERÁ COLOCAR O NOME DO SEU BANCO DE DADOS
    const collection = db.collection('partnerPolos'); // E AQUI VOCÊ DEVE COLOCAR O NOME DE SUA COLLECTION

    const data = await collection.find({}).toArray();


    // ----> TODOS OS DADOS QUE VOCÊ DESEJA COLOCAR EM SUA PLANILHA, PUXANDO DE SUA COLLECTION

    const sheetData = data.map(item => ({
      Nome: item.responsible?.name || 'N/A',
      Email: item.responsible?.email || 'N/A',
      Telefone: item.cellphone || 'N/A',
      WhatsApp: item.whatsapp || 'N/A',
      CPF_CNPJ: item.cpfCnpj || 'N/A',
      Agência: item.agency || 'N/A',
      TagManager: item.integrationhook?.tagmanager || 'N/A',
      Certificador: item.certifierAlias || 'N/A',
      Status: item.status || 'N/A',
      Tipo: item.type || 'N/A',
      CriadoEm: item.createdAt ? new Date(item.createdAt).toISOString() : 'N/A',
      AtualizadoEm: item.updatedAt ? new Date(item.updatedAt).toISOString() : 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename="dados.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.status(200).send(excelBuffer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erro ao exportar os dados.' });  // ERRO CASO TENHA ALGUMA INFORMAÇÃO ERRADA
  }
}

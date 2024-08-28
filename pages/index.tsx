import ExportButton from '../components/ExportButton';

export default function Home() {
  return (
      <div className='mt-48 flex items-center justify-center flex-col'>
        <h1 className='mt-40'>Exportar Dados do MongoDB para Planilha</h1>
        <ExportButton />
      </div>
  );
}

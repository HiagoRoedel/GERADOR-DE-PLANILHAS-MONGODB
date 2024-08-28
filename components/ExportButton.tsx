import React from 'react';

const ExportButton = () => {
  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      
      if (!response.ok) {
        throw new Error('Erro ao exportar os dados');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dados.xlsx');

      document.body.appendChild(link);
      link.click();

      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar os dados. Tente novamente.');
    }
  };

  return (
    <button onClick={handleExport} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded shadow-sm">
      Exportar Dados
    </button>
  );
};

export default ExportButton;

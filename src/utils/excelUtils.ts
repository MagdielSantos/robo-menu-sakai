
/**
 * Excel utility functions for generating and downloading Excel files
 */

import { RPAExecution } from "@/services/RPAService";

// Function to convert an array of objects to CSV format
const convertToCSV = (objArray: any[]): string => {
  if (objArray.length === 0) return '';
  
  const headers = Object.keys(objArray[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const item of objArray) {
    const values = headers.map(header => {
      const val = item[header] || '';
      // Escape quotes and wrap with quotes if the value contains commas or quotes
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Function to download CSV as Excel
export const downloadExcel = (fileName: string, data: any[]): void => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }
  
  // Convert data to CSV
  const csv = convertToCSV(data);
  
  // Create a hidden link element
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format date for Excel export
export const formatDateForExcel = (dateString: string | null): string => {
  if (!dateString) return '---';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '---';
  }
};

// Format RPA executions for Excel export
export const formatRPAExecutionsForExcel = (executions: RPAExecution[]): any[] => {
  return executions.map(exec => ({
    "Status": exec.status_proc || "---",
    "Número de processo": exec.numero_de_processo || "---",
    "Nome do documento": exec.nome_do_documento ? exec.nome_do_documento.split('_').join(' ') : "---",
    "Tipo do documento": exec.tipo_do_documento || "---",
    "Caminho do documento": exec.caminho_do_documento || "---",
    "Pasta Max": exec.pasta_max || "---",
    "Tempo de Execução": exec.tempo_de_execucao || "---",
    "Data Cadastrado": formatDateForExcel(exec.data_cadastrado),
    "Data Início Execução": formatDateForExcel(exec.data_inicio_exec),
    "Data Fim Execução": formatDateForExcel(exec.data_fim_exec)
  }));
};

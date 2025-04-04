
/**
 * Excel utility functions for generating and downloading Excel files
 */

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
export const formatRPAExecutionsForExcel = (executions: any[]): any[] => {
  return executions.map(exec => ({
    "Status": exec.status || "---",
    "Número de processo": exec.processNumber || "---",
    "Nome do documento": exec.documentName ? exec.documentName.split('_').join(' ') : "---",
    "Tipo do documento": exec.documentType || "---",
    "Caminho do documento": exec.documentPath || "---",
    "Pasta Max": exec.maxFolder || "---",
    "Tempo de Execução": exec.executionTime || "---",
    "Data Cadastrado": formatDateForExcel(exec.registrationDate),
    "Data Início Execução": formatDateForExcel(exec.startDate),
    "Data Fim Execução": formatDateForExcel(exec.endDate)
  }));
};

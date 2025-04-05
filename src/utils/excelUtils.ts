import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

export const exportExcel = async (title: string, data: any[]) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5dca80545b3c13cd3a03647238fbbda6b14bd5eb
export function formatRPAExecutionsForExcel(executions: RPAExecution[]): Record<string, unknown>[] {
  return executions.map(execution => {
    return {
      Status: execution.status,
      "Número do Processo": execution.processNumber,
      "Nome do Documento": execution.documentName,
      "Tipo do Documento": execution.documentType,
      "Caminho do Documento": execution.documentPath,
      "Pasta Max": execution.maxFolder,
      "Tempo de Execução": execution.executionTime,
      "Data de Cadastro": execution.registrationDate,
      "Data de Início": execution.startDate,
      "Data de Término": execution.endDate
    };
  });
}
<<<<<<< HEAD
=======
=======
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
>>>>>>> 865be18d247a6058042e7b561248557ca64e4d51
>>>>>>> 5dca80545b3c13cd3a03647238fbbda6b14bd5eb

export function downloadExcel(fileName: string, data: Record<string, unknown>[]): void {
  const worksheet = convertToWorksheet(data);
  const csv = convertWorksheetToCSV(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportExcel(fileName: string, data: Record<string, unknown>[]): void {
  // Format and process data
  const formattedData = data.map(item => {
    const newItem: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(item)) {
      // Format document names (replace underscores with spaces and capitalize first letter)
      if (typeof value === 'string' && (
        key === "Nome do Documento" || 
        key === "Tipo do Documento" ||
        key === "Nome do documento" || 
        key === "Tipo do documento"
      )) {
        newItem[key] = formatServico(value as string);
      } 
      // Format date fields
      else if (typeof value === 'string' && isISODate(value as string)) {
        newItem[key] = formatDate(value as string);
      }
      // Handle other fields
      else {
        newItem[key] = value || '---';
      }
    }
    
    return newItem;
  });
  
  // Use XLSX library to create proper Excel file
  XLSX.writeFile(createStyledWorkbook(fileName, formattedData), `${fileName}_${new Date().getTime()}.xlsx`);
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5dca80545b3c13cd3a03647238fbbda6b14bd5eb
function createStyledWorkbook(sheetName: string, data: Record<string, unknown>[]): XLSX.WorkBook {
  // Create worksheet from JSON data
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Set column widths based on content
  const headers = Object.keys(data[0] || {});
  worksheet['!cols'] = headers.map(header => ({
    wch: Math.max(header.length + 5, 15)
<<<<<<< HEAD
=======
=======
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
>>>>>>> 865be18d247a6058042e7b561248557ca64e4d51
>>>>>>> 5dca80545b3c13cd3a03647238fbbda6b14bd5eb
  }));
  
  // Apply header styling
  if (data.length > 0) {
>>>>>>> 19dd07e75749574a71e3f01fa743588b31521fdb
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const headerStyle = {
      font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }

    const headers = Object.keys(data[0] || {});
    worksheet['!cols'] = headers.map(header => ({
      wch: Math.max(header.length + 5, 15)
    }));

    const workbook = {
      Sheets: { [title]: worksheet },
      SheetNames: [title]
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(blob, `${title}_${new Date().getTime()}.xlsx`);
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    toast.error('Erro ao gerar Excel');
  }
};

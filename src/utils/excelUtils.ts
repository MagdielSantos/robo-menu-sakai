import { RPAExecution } from "@/services/RPAService";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

<<<<<<< HEAD
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
function createStyledWorkbook(sheetName: string, data: Record<string, unknown>[]): XLSX.WorkBook {
  // Create worksheet from JSON data
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Set column widths based on content
  const headers = Object.keys(data[0] || {});
  worksheet['!cols'] = headers.map(header => ({
    wch: Math.max(header.length + 5, 15)
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
  }));
  
  // Apply header styling
  if (data.length > 0) {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      
      // Add header styling
      worksheet[cellAddress].s = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
  }
  
  // Create workbook and add the worksheet
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  return workbook;
}

// Helper functions
function formatServico(servico: string): string {
  if (!servico) return '---';
  return servico.toString().replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
}

function isISODate(value: string): boolean {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

function formatDate(value: string): string {
  if (!value) return "---";
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR') + " " + date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function convertToWorksheet(data: Record<string, unknown>[]): { headers: string[], rows: unknown[][] } {
  if (!data.length) return { headers: [], rows: [] };
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]));
  
  return { headers, rows };
}

function convertWorksheetToCSV(worksheet: { headers: string[], rows: unknown[][] }): string {
  const { headers, rows } = worksheet;
  
  const headerRow = headers.join(',');
  const csvRows = rows.map(row => 
    row.map(cell => {
      // Handle strings with commas
      if (typeof cell === 'string' && cell.includes(',')) {
        return `"${cell}"`;
      }
      return cell === null || cell === undefined ? '' : String(cell);
    }).join(',')
  );
  
  return [headerRow, ...csvRows].join('\n');
}

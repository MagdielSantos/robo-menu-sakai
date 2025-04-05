import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

export const exportExcel = async (title: string, data: any[]) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);

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

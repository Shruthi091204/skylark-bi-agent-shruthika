import * as xlsx from 'xlsx';
import * as path from 'path';
import { Deal, WorkOrder } from './schema';

// Helper to convert Excel serial date to ISO string
function excelDateToISO(serial: number | string | null | undefined): string | null {
  if (serial === null || serial === undefined || serial === '') return null;
  if (typeof serial === 'string') {
    // If it's already a string, maybe it's parsed as text (e.g. "Dec"). Just return it or null if unparseable
    const d = new Date(serial);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof serial === 'number') {
    // Excel serial dates: days since Jan 1, 1900
    // 25569 is the offset for 1970-01-01
    const utcDays = serial - 25569;
    const dateInfo = new Date(utcDays * 86400 * 1000);
    return dateInfo.toISOString();
  }
  return null;
}

// Helper to parse numbers safely
function parseNum(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

// Helper to parse strings safely
function parseStr(val: any): string | null {
  if (val === null || val === undefined || val === '') return null;
  return String(val).trim();
}

export class MockExcelProvider {
  private cachedDeals: Deal[] | null = null;
  private cachedWorkOrders: WorkOrder[] | null = null;

  async getDeals(): Promise<Deal[]> {
    if (this.cachedDeals) return this.cachedDeals;

    const filePath = path.join(process.cwd(), 'Deal funnel Data.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets['Deal tracker'];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const deals: Deal[] = [];
    
    // Headers are in row 0
    for (let i = 1; i < data.length; i++) {
      const row = data[i] as any[];
      if (!row || row.length === 0) continue;

      const deal: Deal = {
        id: `DEAL_${i}`,
        dealName: parseStr(row[0]) || 'Unknown Deal',
        ownerCode: parseStr(row[1]),
        clientCode: parseStr(row[2]),
        dealStatus: parseStr(row[3]),
        closeDateA: parseStr(row[4]),
        closureProbability: parseStr(row[5]) as any,
        maskedDealValue: parseNum(row[6]),
        tentativeCloseDate: excelDateToISO(row[7]),
        dealStage: parseStr(row[8]),
        productDeal: parseStr(row[9]),
        sectorService: parseStr(row[10]),
        createdDate: excelDateToISO(row[11]),
      };
      
      deals.push(deal);
    }

    this.cachedDeals = deals;
    return deals;
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    if (this.cachedWorkOrders) return this.cachedWorkOrders;

    const filePath = path.join(process.cwd(), 'Work_Order_Tracker Data.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets['work order tracker'];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const workOrders: WorkOrder[] = [];
    
    // In Work_Order_Tracker Data.xlsx, row 0 is empty, row 1 has headers, data starts at row 2
    for (let i = 2; i < data.length; i++) {
      const row = data[i] as any[];
      if (!row || row.length === 0) continue;

      const wo: WorkOrder = {
        id: `WO_${i}`,
        dealNameMasked: parseStr(row[0]),
        customerNameCode: parseStr(row[1]),
        serialNumber: parseStr(row[2]),
        natureOfWork: parseStr(row[3]),
        executionStatus: parseStr(row[5]),
        dateOfPoLoi: excelDateToISO(row[7]),
        documentType: parseStr(row[8]),
        probableStartDate: excelDateToISO(row[9]),
        probableEndDate: excelDateToISO(row[10]),
        bdKamPersonnelCode: parseStr(row[11]),
        sector: parseStr(row[12]),
        typeOfWork: parseStr(row[13]),
        amountInRupeesExclGst: parseNum(row[17]),
        billedValueInRupeesExclGst: parseNum(row[19]),
        amountReceivable: parseNum(row[24]),
        woStatusBilled: parseStr(row[34]),
        billingStatus: parseStr(row[37]),
      };
      
      workOrders.push(wo);
    }

    this.cachedWorkOrders = workOrders;
    return workOrders;
  }
}

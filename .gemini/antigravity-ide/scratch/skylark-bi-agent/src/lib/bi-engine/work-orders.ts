import { dataProvider } from '../data';
import { WorkOrder } from '../data/schema';

export async function getExecutionStatusSummary(): Promise<Record<string, number>> {
  const wos = await dataProvider.getWorkOrders();
  const summary: Record<string, number> = {};
  
  wos.forEach(w => {
    const status = w.executionStatus || 'Unknown';
    summary[status] = (summary[status] || 0) + 1;
  });
  
  return summary;
}

export async function getTotalBilledValue(sector?: string): Promise<{ billed: number, receivable: number }> {
  let wos = await dataProvider.getWorkOrders();
  
  if (sector) {
    wos = wos.filter(w => w.sector?.toLowerCase() === sector.toLowerCase());
  }

  const billed = wos.reduce((sum, w) => sum + (w.billedValueInRupeesExclGst || 0), 0);
  const receivable = wos.reduce((sum, w) => sum + (w.amountReceivable || 0), 0);
  
  return { billed, receivable };
}

export async function getProjectsNeedingAttention(): Promise<WorkOrder[]> {
  const wos = await dataProvider.getWorkOrders();
  // Attention needed if execution is not started or billing is required and it's old
  return wos.filter(w => 
    w.billingStatus === 'Update Required' || 
    (w.executionStatus === 'Not Started' && w.amountReceivable !== null && w.amountReceivable > 0)
  ).slice(0, 10);
}

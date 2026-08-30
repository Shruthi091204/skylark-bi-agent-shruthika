import { getDealsBySector } from './deals';
import { getTotalBilledValue } from './work-orders';
import { dataProvider } from '../data';

export async function getSectorPerformanceComparison(): Promise<Record<string, { pipelineValue: number, billedValue: number }>> {
  const dealsBySector = await getDealsBySector();
  const workOrders = await dataProvider.getWorkOrders();
  
  const result: Record<string, { pipelineValue: number, billedValue: number }> = {};
  
  for (const [sector, pipelineValue] of Object.entries(dealsBySector)) {
    result[sector] = { pipelineValue, billedValue: 0 };
  }
  
  workOrders.forEach(w => {
    const sector = w.sector || 'Unknown';
    if (!result[sector]) {
      result[sector] = { pipelineValue: 0, billedValue: 0 };
    }
    result[sector].billedValue += (w.billedValueInRupeesExclGst || 0);
  });
  
  return result;
}

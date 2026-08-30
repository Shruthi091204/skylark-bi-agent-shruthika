import { dataProvider } from '../data';
import { Deal } from '../data/schema';

export async function getTotalPipelineValue(sector?: string): Promise<{ value: number, dealCount: number, deals: Deal[] }> {
  const deals = await dataProvider.getDeals();
  let relevantDeals = deals;
  
  if (sector) {
    relevantDeals = relevantDeals.filter(d => d.sectorService?.toLowerCase() === sector.toLowerCase());
  }

  // Filter out lost deals if we only want active pipeline, but let's assume 'Open' and others
  relevantDeals = relevantDeals.filter(d => d.dealStatus !== 'Lost' && d.dealStatus !== 'Closed Lost');

  const value = relevantDeals.reduce((sum, d) => sum + (d.maskedDealValue || 0), 0);
  
  return {
    value,
    dealCount: relevantDeals.length,
    deals: relevantDeals,
  };
}

export async function getDealsByStage(): Promise<Record<string, number>> {
  const deals = await dataProvider.getDeals();
  const stages: Record<string, number> = {};
  
  deals.forEach(d => {
    const stage = d.dealStage || 'Unknown';
    stages[stage] = (stages[stage] || 0) + (d.maskedDealValue || 0);
  });
  
  return stages;
}

export async function getDealsBySector(): Promise<Record<string, number>> {
  const deals = await dataProvider.getDeals();
  const sectors: Record<string, number> = {};
  
  deals.forEach(d => {
    const sector = d.sectorService || 'Unknown';
    sectors[sector] = (sectors[sector] || 0) + (d.maskedDealValue || 0);
  });
  
  return sectors;
}

export async function getTopOpportunities(limit: number = 5): Promise<Deal[]> {
  const deals = await dataProvider.getDeals();
  const activeDeals = deals.filter(d => d.dealStatus === 'Open');
  return activeDeals
    .sort((a, b) => (b.maskedDealValue || 0) - (a.maskedDealValue || 0))
    .slice(0, limit);
}

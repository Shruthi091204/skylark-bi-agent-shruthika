import { getTotalPipelineValue, getTopOpportunities } from './deals';
import { getTotalBilledValue, getProjectsNeedingAttention } from './work-orders';

export async function compileLeadershipBriefingData() {
  const { value: pipelineValue, dealCount } = await getTotalPipelineValue();
  const topDeals = await getTopOpportunities(3);
  const { billed, receivable } = await getTotalBilledValue();
  const attentionWOs = await getProjectsNeedingAttention();
  
  return {
    pipelineSummary: { totalValue: pipelineValue, activeDeals: dealCount },
    topOpportunities: topDeals.map(d => ({ name: d.dealName, value: d.maskedDealValue })),
    financialSummary: { totalBilled: billed, totalReceivable: receivable },
    criticalRisks: attentionWOs.map(w => ({ name: w.dealNameMasked, issue: w.billingStatus }))
  };
}

export interface Deal {
  id: string; // generated or row index
  dealName: string;
  ownerCode: string | null;
  clientCode: string | null;
  dealStatus: string | null;
  closeDateA: string | null;
  closureProbability: 'High' | 'Medium' | 'Low' | null;
  maskedDealValue: number | null;
  tentativeCloseDate: string | null; // ISO Date
  dealStage: string | null;
  productDeal: string | null;
  sectorService: string | null;
  createdDate: string | null; // ISO Date
}

export interface WorkOrder {
  id: string; // generated or row index
  dealNameMasked: string | null;
  customerNameCode: string | null;
  serialNumber: string | null;
  natureOfWork: string | null;
  executionStatus: string | null;
  dateOfPoLoi: string | null; // ISO Date
  documentType: string | null;
  probableStartDate: string | null; // ISO Date
  probableEndDate: string | null; // ISO Date
  bdKamPersonnelCode: string | null;
  sector: string | null;
  typeOfWork: string | null;
  amountInRupeesExclGst: number | null;
  billedValueInRupeesExclGst: number | null;
  amountReceivable: number | null;
  woStatusBilled: string | null;
  billingStatus: string | null;
}

import { MockExcelProvider } from './MockExcelProvider';
import { Deal, WorkOrder } from './schema';

import { MondayProvider } from './MondayProvider';

export interface DataProvider {
  getDeals(): Promise<Deal[]>;
  getWorkOrders(): Promise<WorkOrder[]>;
}

// STRICT PRODUCTION ENFORCEMENT:
// If deployed (NODE_ENV === 'production'), we MUST use Monday.com API.
// Mock data is only allowed in local development if USE_MOCK_DATA is 'true'.
const isProd = process.env.NODE_ENV === 'production';
const useMock = !isProd && process.env.USE_MOCK_DATA === 'true';

export const dataProvider: DataProvider = useMock 
    ? new MockExcelProvider() 
    : new MondayProvider();

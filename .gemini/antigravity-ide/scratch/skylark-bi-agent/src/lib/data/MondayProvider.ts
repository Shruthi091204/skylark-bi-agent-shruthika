import { Deal, WorkOrder } from './schema';

const MONDAY_API_URL = 'https://api.monday.com/v2';

export class MondayProvider {
  private apiToken: string;
  private dealsBoardId: string;
  private workOrdersBoardId: string;

  constructor() {
    this.apiToken = process.env.MONDAY_API_TOKEN || '';
    this.dealsBoardId = process.env.DEALS_BOARD_ID || '';
    this.workOrdersBoardId = process.env.WORK_ORDERS_BOARD_ID || '';
  }

  private async fetchBoardItems(boardId: string) {
    if (!this.apiToken || !boardId) {
      throw new Error(`Missing Monday.com configuration for board ${boardId}`);
    }

    const query = `
      query {
        boards(ids: [${boardId}]) {
          items_page(limit: 500) {
            items {
              id
              name
              column_values {
                column {
                  title
                }
                text
                value
              }
            }
          }
        }
      }
    `;

    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiToken,
        'API-Version': '2023-10'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Monday.com API error: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors) {
      throw new Error(`Monday.com GraphQL error: ${JSON.stringify(json.errors)}`);
    }

    return json.data.boards[0].items_page.items;
  }

  // Helper to extract a column value by its title (ignoring case)
  private getColumnText(item: any, title: string): string | null {
    const col = item.column_values.find((c: any) => c.column.title.toLowerCase() === title.toLowerCase());
    if (!col || !col.text) return null;
    return col.text.trim();
  }

  private parseNum(val: string | null): number | null {
    if (!val) return null;
    // Strip commas and currency symbols
    const clean = val.replace(/[^0-9.-]+/g, "");
    const num = Number(clean);
    return isNaN(num) ? null : num;
  }
  
  // Basic date normalizer (assumes YYYY-MM-DD or standard formats from Monday)
  private parseDate(val: string | null): string | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  async getDeals(): Promise<Deal[]> {
    const items = await this.fetchBoardItems(this.dealsBoardId);
    
    return items.map((item: any) => ({
      id: item.id,
      dealName: item.name,
      ownerCode: this.getColumnText(item, 'Owner code'),
      clientCode: this.getColumnText(item, 'Client Code'),
      dealStatus: this.getColumnText(item, 'Deal Status'),
      closeDateA: this.getColumnText(item, 'Close Date (A)'),
      closureProbability: this.getColumnText(item, 'Closure Probability') as any,
      maskedDealValue: this.parseNum(this.getColumnText(item, 'Masked Deal value')),
      tentativeCloseDate: this.parseDate(this.getColumnText(item, 'Tentative Close Date')),
      dealStage: this.getColumnText(item, 'Deal Stage'),
      productDeal: this.getColumnText(item, 'Product deal'),
      sectorService: this.getColumnText(item, 'Sector/service'),
      createdDate: this.parseDate(this.getColumnText(item, 'Created Date')),
    }));
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    const items = await this.fetchBoardItems(this.workOrdersBoardId);
    
    return items.map((item: any) => ({
      id: item.id,
      dealNameMasked: item.name, // Assuming 'Deal name masked' is the item name
      customerNameCode: this.getColumnText(item, 'Customer Name Code'),
      serialNumber: this.getColumnText(item, 'Serial #'),
      natureOfWork: this.getColumnText(item, 'Nature of Work'),
      executionStatus: this.getColumnText(item, 'Execution Status'),
      dateOfPoLoi: this.parseDate(this.getColumnText(item, 'Date of PO/LOI')),
      documentType: this.getColumnText(item, 'Document Type'),
      probableStartDate: this.parseDate(this.getColumnText(item, 'Probable Start Date')),
      probableEndDate: this.parseDate(this.getColumnText(item, 'Probable End Date')),
      bdKamPersonnelCode: this.getColumnText(item, 'BD/KAM Personnel code'),
      sector: this.getColumnText(item, 'Sector'),
      typeOfWork: this.getColumnText(item, 'Type of Work'),
      amountInRupeesExclGst: this.parseNum(this.getColumnText(item, 'Amount in Rupees (Excl of GST) (Masked)')),
      billedValueInRupeesExclGst: this.parseNum(this.getColumnText(item, 'Billed Value in Rupees (Excl of GST.) (Masked)')),
      amountReceivable: this.parseNum(this.getColumnText(item, 'Amount Receivable (Masked)')),
      woStatusBilled: this.getColumnText(item, 'WO Status (billed)'),
      billingStatus: this.getColumnText(item, 'Billing Status'),
    }));
  }
}

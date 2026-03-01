export interface CashflowItem {
  id: string;
  name: string;
  amount: number;
}

export interface SubCategory {
  id: string;
  name: string;
  items: CashflowItem[];
}

export interface Category {
  id: string;
  name: string;
  type: "revenue" | "investment" | "expense";
  subCategories: SubCategory[];
}

export interface InvestmentStats {
  currentPercentage: number; // % of revenue currently invested
  possiblePercentage: number; // % of revenue if fully invested
  currentAmount: number;
  possibleAmount: number;
}

export interface CashflowData {
  categories: Category[];
  currency: string;
}

export interface SankeyNode {
  name: string;
  value: number;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

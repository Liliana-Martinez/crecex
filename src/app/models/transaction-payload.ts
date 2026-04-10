export interface TransactionPayload {
  income?: {
    amount: number;
    description: string;
  };
  expense?: {
    amount: number;
    description: string;
  };
}

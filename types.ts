
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum IncomeCategory {
  SALARY = 'Salary',
  BUSINESS = 'Business',
  FREELANCE = 'Freelance',
  OTHER = 'Other income'
}

export enum ExpenseCategory {
  FOOD = 'Food 🍔',
  TRAVEL = 'Travel 🚕',
  RENT = 'Rent 🏠',
  SHOPPING = 'Shopping 🛍️',
  BILLS = 'Bills 💡',
  ENTERTAINMENT = 'Entertainment 🎬',
  MEDICAL = 'Medical 💊',
  EDUCATION = 'Education 📚',
  OTHER = 'Other'
}

export enum PaymentMode {
  CASH = 'Cash',
  UPI = 'UPI',
  CARD = 'Card',
  BANK = 'Bank'
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  paymentMode: PaymentMode;
  notes?: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface AppState {
  user: User | null;
  transactions: Transaction[];
  theme: 'light' | 'dark';
}

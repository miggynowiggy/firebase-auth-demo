import { IUser } from './user'

export const ExpenseTypes = ['Bills', 'Food', 'Grocery', 'Transportation', 'Payment', 'Fund Transfer', 'Emergency']

export type TExpenseType = 'Bills' | 'Food' | 'Grocery' | 'Transportation' | 'Payment' | 'Fund Transfer' | 'Emergency'

export interface IExpense {
  id: number
  description: string
  type: TExpenseType
  amount: number
  date: Date | string
  createdAt: Date
  updatedAt: Date
  User: IUser
}

export interface ICreateExpense {
  description: string
  amount: number
  date?: Date | string
  type: TExpenseType
}

export interface IUpdateExpense {
  id: number;
  description?: String
  amount?: number
  date?: Date | string
  type?: TExpenseType
}

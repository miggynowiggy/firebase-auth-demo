import { IExpense } from "@/models";
import { defineStore } from "pinia";

interface ExpensesStore {
  expenses: IExpense[],
  expense: IExpense | null
}

export const useExpensesStore = defineStore('expensesStore', {
  state: (): ExpensesStore => ({
    expenses: [
      {
        id: 1,
        description: 'Entry',
        amount: 123.45,
        type: 'Bills',
        createdAt: new Date('2022-11-10'),
        updatedAt: new Date('2022-11-10'),
        User: {
          fullName: '',
          email: '',
          id: 1,
          uid: ''
        }
      },
      {
        id: 2,
        description: 'Entry 2',
        amount: 354.45,
        type: 'Fund Transfer',
        createdAt: new Date('2022-11-11'),
        updatedAt: new Date('2022-11-11'),
        User: {
          fullName: '',
          email: '',
          id: 1,
          uid: ''
        }
      }
    ],
    expense: null
  }),
  getters: {
    allExpenses: (state) => state.expenses,
    currentExpense: (state) => state.expense
  },
  actions: {
    clearStore() {
      this.expense = null
      this.expenses = []
    },
    setExpenses(expenses: IExpense[] | null) {
      if (expenses) {
        this.expenses = expenses
      }
    },
    addExpense(expense: IExpense) {
      this.expenses.push(expense)
    },
    updateExpense(expense: IExpense) {
      const index = this.expenses.findIndex(e => e.id === expense.id);

      if (index >= 0) {
        this.expenses.splice(index, 1, expense)
      }
    },
    removeExpense(id: number) {
      const index = this.expenses.findIndex(e => e.id === id);

      if (index >= 0) {
        this.expenses.splice(index, 1)
      }
    }
  }
})
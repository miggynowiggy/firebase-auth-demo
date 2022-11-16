import API from 'src/configs/axios'
import { ICreateExpense, IExpense, IUpdateExpense } from 'src/models'
import dayjs from 'dayjs'

const URL = {
  getAll: 'expenses/all',
  getOne: 'expenses/{}',
  add: 'expenses/new',
  update: 'expenses/edit',
  remove: 'expenses/{}',
}

export async function GetExpenses() {
  try {
    const response: IExpense[] | null = await API.get(URL.getAll)
    return response
  } catch (err) {
    console.log('ERR WHILE GETTING USER EXPENSES: ', err)
    return null
  }
}

export async function GetExpense(id: number) {
  try {
    const response: IExpense | null = await API.get(
      URL.getOne.replace('{}', String(id))
    )
    return response
  } catch (err) {
    console.log('ERR WHILE GETTING ONE EXPENSE: ', err)
    return null
  }
}

export async function CreateExpense(task: ICreateExpense) {
  try {
    const response: IExpense | null = await API.post(URL.add, task)
    return response
  } catch (err) {
    console.log('ERR WHILE CREATING A EXPENSE: ', err)
    return null
  }
}

export async function UpdateExpense(expense: IUpdateExpense) {
  try {
    const response: IExpense | null = await API.put(URL.update, expense)
    return response
  } catch (err) {
    console.log('ERR WHILE UPDATING EXPENSE: ', err)
    return null
  }
}

export async function DeleteExpense(id: number) {
  try {
    const response: boolean = await API.delete(
      URL.remove.replace('{}', String(id))
    )
    return response
  } catch (err) {
    console.log('ERR WHILE DELETING EXPENSE: ', err)
    return null
  }
}

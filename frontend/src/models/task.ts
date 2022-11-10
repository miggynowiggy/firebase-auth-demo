import { IUser } from './user'

export interface ITask {
  id: number
  content: string
  isDone: boolean
  createdAt: Date
  updatedAt: Date
  User: IUser
}

export interface ICreateTask {
  content: String
  isDone: boolean
  userId: number
}

export interface IUpdateTask {
  content?: String
  isDone?: boolean
  userId: number
}

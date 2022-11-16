export interface IUser {
  id: number
  uid: string
  email: string
  fullName: string
  profilePicture?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ICreateUser {
  uid: string
  email: string
  fullName: string
  profilePicture?: string
}

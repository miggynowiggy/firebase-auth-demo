import API from '@/configs/axios'
import { ICreateUser, IUser } from '@/models'

const URLS = {
  createUser: 'users/create',
  checkUserByEmail: 'auth/check?email={}'
}

export async function CreateUser(user: ICreateUser): Promise<IUser | null> {
  try {
    const response: IUser | null = await API.post(URLS.createUser, user);
    return response;
  } catch (err) {
    console.log('ERR IN CREATE USER: ', err)
    return null
  }
}

export async function CheckUserByEmail(email: string): Promise<IUser | null> {
  try {
    const response: IUser | null = await API.get(URLS.checkUserByEmail.replace('{}', email));
    return response
  } catch (err) {
    console.log('ERR IN CHECKING USER: ', err)
    return null
  }
}

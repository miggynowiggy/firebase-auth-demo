import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential,
  signOut,
  reauthenticateWithCredential,
  updatePassword,
  OAuthProvider
} from 'firebase/auth'
import { AUTH } from '@/configs/firebase'

const GoogleProvider = new GoogleAuthProvider()

export async function LoginByEmailPassword(email: string, password: string) {
  try {
    const user = await signInWithEmailAndPassword(AUTH, email, password)
    return user
  } catch (err) {
    console.log('ERR IN LOGGING IN: ', err)
    throw err
  }
}

export async function LoginByGoogle() {
  try {
    const result = await signInWithPopup(AUTH, GoogleProvider)
    const credentials = GoogleAuthProvider.credentialFromResult(result)

    return {
      user: result.user,
      token: credentials,
    }
  } catch (err) {
    console.log('ERR WHILE LOGGING IN THROUGH GOOGLE: ', err)
    throw err
  }
}

export async function LoginByDiscord() {
  try {
    const provider = new OAuthProvider('oidc.discord')
    const results = await signInWithPopup(AUTH, provider);

    const credentials = OAuthProvider.credentialFromResult(results);
    const accessToken = credentials?.accessToken;
    const idToken = credentials?.idToken;

    return { idToken, accessToken }
  } catch (err) {
    console.log('ERR WHILE LOGGING IN WITH DISCORD: ', err)
    throw err
  }
}

export async function RegisterByEmailPassword(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(AUTH, email, password)
    await sendEmailVerification(userCredential.user);
    return userCredential.user
  } catch (err) {
    console.log('ERR IN REGISTERING USER TO FIREBASE: ', err)
    throw err
  }
}

export async function SendEmailVerification(authUser: UserCredential) {
  try {
    await sendEmailVerification(authUser.user)
  } catch (err) {
    console.log('ERR IN SENDING EMAIL VERIFICATION: ', err)
    throw err
  }
}

export async function SendForgotPassword(email: string) {
  try {
    await sendPasswordResetEmail(AUTH, email)
  } catch (err) {
    console.log('ERR WHILE SENDING FORGOT PASSWORD: ', err)
    throw err
  }
}

export async function ChangePassword(oldPassword: string, newPassword: string) {
  try {
    const email = AUTH.currentUser?.email as string
    await signInWithEmailAndPassword(AUTH, email, oldPassword)

    await updatePassword(AUTH.currentUser as User, newPassword);
  } catch (err) {
    console.log('ERR WHILE CHANGING PASSWORD: ', err)
    throw err
  }
} 

export async function Logout() {
  try {
    signOut(AUTH)
  } catch (err) {
    console.log('ERR WHILE LOGGING OUT: ', err)
    throw err
  }
}

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import constants from './constants'

const firebaseConfig = {
  apiKey: constants.FIREBASE_API_KEY,
  authDomain: constants.FIREBASE_AUTH_DOMAIN,
  projectId: constants.FIREBASE_PROJECT_ID,
  storageBucket: constants.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: constants.FIREBASE_MESSAGING_SENDER_ID,
  appId: constants.FIREBASE_APP_ID,
  measurementId: constants.FIREBASE_MEASUREMENT_ID
}

export const FIREBASE = initializeApp(firebaseConfig)
export const AUTH = getAuth(FIREBASE)
export const ANALYTICS = getAnalytics(FIREBASE)

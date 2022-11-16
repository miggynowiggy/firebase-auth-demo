/* eslint-disable @typescript-eslint/no-var-requires */
import admin from 'firebase-admin';
const serviceAccount = Buffer.from(process.env.SERVICE_ACCOUNT, 'base64');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.toString('utf-8')),
});

export default admin;

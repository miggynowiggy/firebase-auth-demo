import { DecodedIdToken } from 'firebase-admin/auth';

export {};

declare global {
  namespace Express {
    export interface Request {
      firebaseUser: DecodedIdToken;
    }
  }
}

declare namespace Express {
  export interface Request {
    firebaseUser: DecodedIdToken;
  }
}

/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, App, getApps } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  public readonly auth: Auth;
  public readonly firebase: App;

  constructor(private readonly configs: ConfigService) {
    if (!this.firebase && getApps().length === 0) {
      const serviceAccountString = Buffer.from(
        this.configs.get<string>('SERVICE_ACCOUNT'),
        'base64',
      );
      const serviceAccount = JSON.parse(serviceAccountString.toString('ascii'));
      this.firebase = initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      this.firebase = getApps()[0];
    }

    this.auth = getAuth(this.firebase);
  }
}

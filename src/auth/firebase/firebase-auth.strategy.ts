import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import firebase_params from '../firebase/firebase.params';

import { Role } from '../enums/role.enum';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: any;
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params(configService)),
    });
  }
  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((error) => {
        throw new UnauthorizedException(error.message);
      });

    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    firebaseUser.roles = Role.User;

    if (firebaseUser.uid === this.configService.get('ADMIN_UID')) {
      firebaseUser.roles = Role.Admin;
    }

    return { firebaseUser };
  }
}

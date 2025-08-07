import { computed, Injectable } from '@angular/core';
import { JwtDecoded, JwtPayload } from '../models/jwt.model';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private currentJwt = signal<JwtDecoded | null>(null);
  public valid = computed(() => {
    const jwt = this.currentJwt();
    return jwt ? this.isValidJwt(jwt) : false;
  });

  public signatureValid = computed(() => {
    const jwt = this.currentJwt();
    return jwt ? this.isSignatureValid(jwt) : false;
  });

  decodeJwt(jwt: string, signingKey: string): any {
    if (!jwt) return null;

    const parts = jwt.split('.');
    if (parts.length !== 3) return null;

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload, signature: parts[2] };
    } catch (e) {
      console.error('Invalid JWT format', e);
      return null;
    }
  }

  private isValidJwt(jwt: JwtDecoded): boolean {
    if (!jwt || !jwt.signature) {
      return false;
    }

    this.validateClaims(jwt.payload);
    this.validateIssuer(jwt.payload.iss);
    this.validateAudience(jwt.payload.aud);

    return true;
  }

  private isSignatureValid(jwt: JwtDecoded): boolean {
    if (!jwt || !jwt.header || !jwt.signature) {
      return false;
    }

    if (jwt.header.alg === 'HS256') {
      return this.verifyHS256Signature(jwt);
    }
    if (jwt.header.alg === 'RS256') {
      return this.verifyRS256Signature(jwt);
    }

    if (jwt.header.alg === 'PS256') {
      return this.verifyPS256Signature(jwt); 
    }

    console.warn('Unsupported JWT algorithm:', jwt.header.alg);

    return false; // Placeholder for actual implementation
  }

  private verifyPS256Signature(jwt: JwtDecoded): boolean {
    throw new Error('Method not implemented.');
  }

  private validateAudience(aud: any) {
    throw new Error('Method not implemented.');
  }

  private validateIssuer(iss: any) {
    throw new Error('Method not implemented.');
  }

  private validateClaims(payload: JwtPayload) {
    throw new Error('Method not implemented.');
  }

  private verifyHS256Signature(jwt: JwtDecoded): boolean {
    return true;
  }

  private verifyRS256Signature(jwt: JwtDecoded): boolean {
    // Implement RS256 signature verification logic here
    return true;
  }
}

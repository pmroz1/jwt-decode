import { computed, Injectable } from '@angular/core';
import { JwtDecoded, JwtPayload } from '../models/jwt.model';
import { signal } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';

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

  decodeJwt(jwt: string, signingKey?: string): JwtDecoded | null {
    if (!jwt) {
      this.currentJwt.set(null);
      return null;
    }

    const parts = jwt.split('.');
    if (parts.length !== 3) {
      this.currentJwt.set(null);
      return null;
    }

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const decoded: JwtDecoded = { 
        header, 
        payload, 
        signature: parts[2],
        raw: jwt,
        signingKey: signingKey || ''
      };
      
      this.currentJwt.set(decoded);
      return decoded;
    } catch (e) {
      console.error('Invalid JWT format', e);
      this.currentJwt.set(null);
      return null;
    }
  }

  private isValidJwt(jwt: JwtDecoded): boolean {
    if (!jwt || !jwt.signature) {
      return false;
    }

    const claimsValid = this.validateClaims(jwt.payload);
    const issuerValid = this.validateIssuer(jwt.payload.iss);
    const audienceValid = this.validateAudience(jwt.payload.aud);

    return claimsValid && issuerValid && audienceValid;
  }

  private isSignatureValid(jwt: JwtDecoded): boolean {
    if (!jwt || !jwt.header || !jwt.signature) {
      return false;
    }

    if (jwt.header.alg === 'HS256') {
      return this.verifyHS256Signature(jwt);
    }
    if (jwt.header.alg === 'HS384') {
      return this.verifyHS384Signature(jwt);
    }
    if (jwt.header.alg === 'HS512') {
      return this.verifyHS512Signature(jwt);
    }
    if (jwt.header.alg === 'RS256') {
      return this.verifyRS256Signature(jwt);
    }
    if (jwt.header.alg === 'PS256') {
      return this.verifyPS256Signature(jwt); 
    }

    console.warn('Unsupported JWT algorithm:', jwt.header.alg);
    return false;
  }

  private verifyPS256Signature(jwt: JwtDecoded): boolean {
    if (!jwt.signingKey) {
      console.warn('No public key provided for PS256 verification');
      return false;
    }

    try {
      const parts = jwt.raw.split('.');
      const signingInput = `${parts[0]}.${parts[1]}`;
      const signature = this.base64UrlDecode(jwt.signature);
      const publicKey = forge.pki.publicKeyFromPem(jwt.signingKey);
      const md = forge.md.sha256.create();
      md.update(signingInput, 'utf8');
      const pss = forge.pss.create({
        md: forge.md.sha256.create(),
        mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
        saltLength: 32
      });
      return publicKey.verify(md.digest().bytes(), signature, pss);
    } catch (error) {
      console.error('Error verifying PS256 signature:', error);
      return false;
    }
  }

  private validateAudience(aud: string | string[] | undefined): boolean {
    if (!aud) {
      console.info('JWT token has no audience (optional)');
      return true;
    }
    return true;
  }

  private validateIssuer(iss: string | undefined): boolean {
    if (!iss) {
      console.info('JWT token has no issuer (optional)');
      return true;
    }
    return true;
  }

  private validateClaims(payload: JwtPayload): boolean {
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      console.warn('JWT token is expired');
      return false;
    }
    
    if (payload.iat && payload.iat > now) {
      console.warn('JWT token is not yet valid');
      return false;
    }
    
    return true;
  }

  private verifyHS256Signature(jwt: JwtDecoded): boolean {
    if (!jwt.signingKey) {
      console.warn('No signing key provided for HS256 verification');
      return false;
    }

    try {
      const parts = jwt.raw.split('.');
      const signingInput = `${parts[0]}.${parts[1]}`;
      const hash = CryptoJS.HmacSHA256(signingInput, jwt.signingKey);
      const computedSignature = this.base64UrlEscape(CryptoJS.enc.Base64.stringify(hash));
      return computedSignature === jwt.signature;
    } catch (error) {
      console.error('Error verifying HS256 signature:', error);
      return false;
    }
  }

  private verifyHS384Signature(jwt: JwtDecoded): boolean {
    if (!jwt.signingKey) {
      console.warn('No signing key provided for HS384 verification');
      return false;
    }

    try {
      const parts = jwt.raw.split('.');
      const signingInput = `${parts[0]}.${parts[1]}`;
      const hash = CryptoJS.HmacSHA384(signingInput, jwt.signingKey);
      const computedSignature = this.base64UrlEscape(CryptoJS.enc.Base64.stringify(hash));
      return computedSignature === jwt.signature;
    } catch (error) {
      console.error('Error verifying HS384 signature:', error);
      return false;
    }
  }

  private verifyHS512Signature(jwt: JwtDecoded): boolean {
    if (!jwt.signingKey) {
      console.warn('No signing key provided for HS512 verification');
      return false;
    }

    try {
      const parts = jwt.raw.split('.');
      const signingInput = `${parts[0]}.${parts[1]}`;
      const hash = CryptoJS.HmacSHA512(signingInput, jwt.signingKey);
      const computedSignature = this.base64UrlEscape(CryptoJS.enc.Base64.stringify(hash));
      return computedSignature === jwt.signature;
    } catch (error) {
      console.error('Error verifying HS512 signature:', error);
      return false;
    }
  }

  private verifyRS256Signature(jwt: JwtDecoded): boolean {
    if (!jwt.signingKey) {
      console.warn('No public key provided for RS256 verification');
      return false;
    }

    try {
      const parts = jwt.raw.split('.');
      const signingInput = `${parts[0]}.${parts[1]}`;
      const signature = this.base64UrlDecode(jwt.signature);
      const publicKey = forge.pki.publicKeyFromPem(jwt.signingKey);
      const md = forge.md.sha256.create();
      md.update(signingInput, 'utf8');
      return publicKey.verify(md.digest().bytes(), signature);
    } catch (error) {
      console.error('Error verifying RS256 signature:', error);
      return false;
    }
  }

  private base64UrlEscape(str: string): string {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str += new Array(5 - (str.length % 4)).join('=');
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
  }
}

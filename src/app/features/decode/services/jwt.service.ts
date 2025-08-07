import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  decodeJwt(jwt: string): any {
    if (!jwt) return null;

    const parts = jwt.split('.');
    if (parts.length !== 3) return null;

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      console.log('Decoded JWT Header:', header);
      console.log('Decoded JWT Payload:', payload);
      console.log('JWT Signature:', parts[2]);
      return { header, payload, signature: parts[2] };
    } catch (e) {
      console.error('Invalid JWT format', e);
      return null;
    }
  }
}

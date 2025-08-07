import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringUtilsService {
  colorJwtString(jwt: string): string {
    if (!jwt) return '';

    const parts = jwt.split('.');
    if (parts.length !== 3) return jwt;

    const header = `<span class="text-blue-500">${parts[0]}</span>`;
    const payload = `<span class="text-green-500">${parts[1]}</span>`;
    const signature = `<span class="text-red-500">${parts[2]}</span>`;

    return `${header}.${payload}.${signature}`;
  }
}

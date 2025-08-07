import { inject, Injectable, WritableSignal } from '@angular/core';
import { StringUtilsService } from './string-utils.service';
import { TagService } from './tag.service';
import { TagData } from '../models';
import { SeverityType } from '../dictionaries/severity-type.dictionary';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class DecodeFacadeService {
  stringUtilsService = inject(StringUtilsService);
  tagService = inject(TagService);
  jwtService = inject(JwtService);

  colorJwtString(jwt: string): string {
    return this.stringUtilsService.colorJwtString(jwt);
  }

  blinkTag(
    message: string,
    severity: SeverityType,
    inputTags: WritableSignal<TagData[]>
  ) {
    this.tagService.blinkTag(message, severity, inputTags);
  }

  decodeJwt(jwt: string, signingKey: string): any {
    return this.jwtService.decodeJwt(jwt, signingKey);
  }

  isValidJwt(jwt: string, signingKey: string): boolean {
    return this.jwtService.signatureValid();
  }
}

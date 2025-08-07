import { Injectable, WritableSignal } from '@angular/core';
import { SeverityType } from '../dictionaries/severity-type.dictionary';
import { TagData } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  tagTimeout = 3000;

  updateTagTimeout(timeout: number) {
    this.tagTimeout = timeout;
  }

  blinkTag(
    message: string,
    severity: SeverityType,
    inputTags: WritableSignal<TagData[]>
  ) {
    inputTags.set([...inputTags(), { value: message, severity }]);

    setTimeout(() => {
      inputTags.set(inputTags().filter((tag) => tag.value !== message));
    }, this.tagTimeout);
  }
}

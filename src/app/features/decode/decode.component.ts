import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextAreaComponent } from '@app/shared/components/text-area/text-area.component';
import { exampleEncodedJwt } from '@app/shared/data/example-jwt.data';
import { TagModule } from 'primeng/tag';
import { TagData } from '@features/decode/models/tag.model';
import { SeverityType } from './dictionaries/severity-type.dictionary';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-decode',
  imports: [TextAreaComponent, TagModule, ButtonModule],
  template: `
    <div class="flex flex-row items-center min-h-100 h-full">
      <div class="flex flex-col w-full h-full p-4">
        <div class="flex flex-row justify-between items-center ">
          <p class="text-lg font-semibold">{{ inputHeader }}</p>
          <div class="ml-4 flex flex-wrap gap-2">
            <button pButton severity="secondary" (click)="pasteSampleJwt()">
              <i class="pi pi-eraser" pButtonIcon></i>
              <span pButtonLabel>PASTE SAMPLE JWT</span>
            </button>
            <button pButton severity="secondary" (click)="clearInput()">
              <i class="pi pi-eraser" pButtonIcon></i>
              <span pButtonLabel>CLEAR</span>
            </button>
            <button pButton severity="secondary" (click)="copyToClipboard()">
              <i class="pi pi-copy" pButtonIcon></i>
              <span pButtonLabel>COPY</span>
            </button>
            @for(tag of inputTags(); track $index) {
            <p-tag [value]="tag.value" [severity]="tag.severity"></p-tag>
            }
          </div>
        </div>
        <app-text-area
          class="w-full h-full pt-4"
          [inputValue]="jwt()"
          [placeholder]="'Enter JWT here...'"
        ></app-text-area>
      </div>
      <app-text-area
        class="w-full h-full p-4"
        [placeholder]="''"
      ></app-text-area>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecodeComponent {
  jwt = signal<string>(exampleEncodedJwt.trim());
  decodedJwt = signal<string>('');

  inputHeader = 'JSON Web Token (JWT) Input:';

  inputTags = signal<TagData[]>([
    // { value: 'JWT', severity: SeverityType.Info },
    // { value: 'Decode', severity: SeverityType.Success },
  ]);

  clearInput() {
    this.jwt.set('');
    this.decodedJwt.set('');
  }

  pasteSampleJwt() {
    this.jwt.set(exampleEncodedJwt.trim());
  }

  copyToClipboard() {
    const textToCopy = this.jwt();
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        this.inputTags.set([
          ...this.inputTags(),
          { value: 'Copied to clipboard!', severity: SeverityType.Success },
        ]);

        setTimeout(() => {
          this.inputTags.set(
            this.inputTags().filter(
              (tag) => tag.value !== 'Copied to clipboard!'
            )
          );
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        this.inputTags.set([
          ...this.inputTags(),
          { value: 'Copy failed', severity: SeverityType.Danger },
        ]);
      });
  }
}

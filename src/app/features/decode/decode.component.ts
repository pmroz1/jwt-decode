import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TextAreaComponent } from '@app/shared/components/text-area/text-area.component';
import {
  exampleEncodedJwt,
  exampleSigningKey,
} from '@app/shared/data/example-jwt.data';
import { TagModule } from 'primeng/tag';
import { TagData } from '@features/decode/models/tag.model';
import { SeverityType } from './dictionaries/severity-type.dictionary';
import { ButtonModule } from 'primeng/button';
import { DecodeFacadeService } from './services/decode-facade.service';
import { SummaryAreaComponent } from './components';

@Component({
  selector: 'app-decode',
  imports: [TextAreaComponent, TagModule, ButtonModule, SummaryAreaComponent],
  template: `
    <div class="flex flex-row items-stretch h-full">
      <div class="flex flex-col flex-1 h-full pt-4">
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
            <button
              pButton
              severity="secondary"
              (click)="copyToClipboard(jwt())"
            >
              <i class="pi pi-copy" pButtonIcon></i>
              <span pButtonLabel>COPY</span>
            </button>
            @for(tag of encodedJwtInputTags(); track $index) {
            <p-tag [value]="tag.value" [severity]="tag.severity"></p-tag>
            }
          </div>
        </div>
        <app-text-area
          class="w-full h-full pt-4"
          [height]="'h-100'"
          [inputValue]="jwt()"
          [readonly]="false"
          [placeholder]="'Enter JWT here...'"
          (valueChange)="jwtChanged($event)"
        ></app-text-area>
        <app-summary-area
          [header]="signatureHeader"
          [tagList]="summaryTags()"
          [displayValue]="signingKey()"
          [height]="'h-20'"
          [copyFunction]="copyToClipboardWrapper"
        ></app-summary-area>
      </div>
      <div class="flex flex-col flex-1 h-full justify-start p-4">
        <app-summary-area
          [header]="summaryHeader"
          [tagList]="summaryTags()"
          [displayValue]="decodedJwt()"
          [height]="'h-80'"
          [copyFunction]="copyToClipboardWrapper"
        ></app-summary-area>
        <app-summary-area
          [header]="payloadHeader"
          [tagList]="summaryTags()"
          [displayValue]="decodedJwt()"
          [height]="'h-80'"
          [copyFunction]="copyToClipboardWrapper"
        ></app-summary-area>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecodeComponent implements AfterViewInit {
  private serviceFacade = inject(DecodeFacadeService);
  jwt = signal<string>(exampleEncodedJwt.trim());
  signingKey = signal<string>(exampleSigningKey.trim());
  decodedJwt = signal<string>('');
  encodedJwtInputTags = signal<TagData[]>([]);
  summaryTags = signal<TagData[]>([]);

  inputHeader = 'JSON Web Token (JWT) Input:';
  summaryHeader = 'HEADER:';
  payloadHeader = 'PAYLOAD:';
  signatureHeader = 'SIGNATURE:';

  ngAfterViewInit() {
    this.jwtChanged(this.jwt());
  }

  jwtChanged($event: string) {
    console.log('JWT input changed:', $event);
    this.jwt.set($event);
    const decoded = this.serviceFacade.decodeJwt($event, this.signingKey());

    this.decodedJwt.set(
      decoded ? JSON.stringify(decoded, null, 2) : 'Invalid JWT'
    );
  }

  clearInput() {
    this.jwt.set('');
    this.decodedJwt.set('');
  }

  pasteSampleJwt() {
    this.jwt.set(exampleEncodedJwt.trim());
  }

  copyToClipboard(
    textToCopy: string = this.jwt(),
    tagsArraySignal = this.encodedJwtInputTags
  ) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        this.serviceFacade.blinkTag(
          'Copied to clipboard',
          SeverityType.Success,
          tagsArraySignal
        );
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        this.serviceFacade.blinkTag(
          'Failed to copy',
          SeverityType.Danger,
          tagsArraySignal
        );
      });
  }

  copyToClipboardWrapper = (value: string, tags: TagData[]) => {
    this.copyToClipboard(value, this.encodedJwtInputTags);
  };
}

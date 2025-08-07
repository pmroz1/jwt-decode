import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
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
    <div class="flex flex-col items-end h-full p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Decoded JWT</h2>
        <div class="flex gap-2">
          <p-tag
            [value]="
              serviceFacade.isSignatureValid()
                ? '✓ Signature Valid'
                : '✗ Signature Invalid'
            "
            [severity]="serviceFacade.isSignatureValid() ? 'success' : 'danger'"
            class="text-sm"
          ></p-tag>
          <p-tag
            [value]="serviceFacade.isValid() ? '✓ JWT Valid' : '✗ JWT Invalid'"
            [severity]="serviceFacade.isValid() ? 'success' : 'danger'"
            class="text-sm"
          ></p-tag>
        </div>
      </div>
    </div>
    <div class="flex flex-row items-stretch h-full">
      <div class="flex flex-col flex-1 h-full pt-4">
        <div class="flex flex-row justify-between items-center ">
          <p class="text-lg font-semibold">{{ inputHeader }}</p>
          <div class="ml-4 flex flex-wrap gap-2">
            <button pButton severity="secondary" (click)="pasteSampleJwt()">
              <i class="pi pi-file" pButtonIcon></i>
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
            @for(tag of (getTagsArrayFromMap('encodedJwtInputTags')?.() ?? []);
            track $index) {
            <p-tag [value]="tag.value" [severity]="tag.severity"></p-tag>
            }
          </div>
        </div>
        <app-text-area
          class="w-full pt-4"
          [height]="'h-100'"
          [inputValue]="jwt()"
          [readonly]="false"
          [placeholder]="'Enter JWT here...'"
          (valueChange)="jwtChanged($event)"
        ></app-text-area>
        <div class="flex flex-col pt-4">
          <div class="flex flex-row items-center justify-between mb-2">
            <p class="text-lg font-semibold">{{ signatureHeader }}</p>
            <div class="ml-4 flex flex-wrap gap-2">
              <button
                pButton
                severity="secondary"
                (click)="copyToClipboard(signingKey(), signatureHeader)"
              >
                <i class="pi pi-copy" pButtonIcon></i>
                <span pButtonLabel>COPY</span>
              </button>
              @for(tag of (getTagsArrayFromMap(this.signatureHeader)?.() ?? []);
              track $index) {
              <p-tag [value]="tag.value" [severity]="tag.severity"></p-tag>
              }
            </div>
          </div>
          <app-text-area
            class="w-full"
            [height]="'h-20'"
            [inputValue]="signingKey()"
            [readonly]="false"
            [placeholder]="'Enter signing key...'"
            (valueChange)="signingKeyChanged($event)"
          ></app-text-area>
        </div>
      </div>
      <div class="flex flex-col flex-1 h-full justify-start p-4">
        <app-summary-area
          [header]="summaryHeader"
          [tagList]="getTagsArrayFromMap(this.summaryHeader)?.() ?? []"
          [displayValue]="headerSection()"
          [height]="'h-80'"
          [copyFunction]="copyToClipboardWrapper"
        ></app-summary-area>
        <app-summary-area
          [header]="payloadHeader"
          [tagList]="getTagsArrayFromMap(this.payloadHeader)?.() ?? []"
          [displayValue]="payloadSection()"
          [height]="'h-80'"
          [copyFunction]="copyToClipboardWrapper"
        ></app-summary-area>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecodeComponent implements AfterViewInit {
  readonly serviceFacade = inject(DecodeFacadeService);
  jwt = signal<string>(exampleEncodedJwt.trim());
  signingKey = signal<string>(exampleSigningKey.trim());
  decodedJwt = signal<string>('');
  private currentDecodedJwt = signal<any>(null);

  inputHeader = 'JSON Web Token (JWT) Input:';
  summaryHeader = 'HEADER:';
  payloadHeader = 'PAYLOAD:';
  signatureHeader = 'SIGNATURE:';

  tagsMap: Map<string, WritableSignal<TagData[]>> = new Map([
    ['encodedJwtInputTags', signal<TagData[]>([])],
    [this.summaryHeader, signal<TagData[]>([])],
    [this.payloadHeader, signal<TagData[]>([])],
    [this.signatureHeader, signal<TagData[]>([])],
  ]);

  ngAfterViewInit() {
    this.jwtChanged(this.jwt());
  }

  getTagsArrayFromMap(key: string): WritableSignal<TagData[]> | undefined {
    return this.tagsMap.get(key);
  }

  headerSection(): string {
    const decoded = this.currentDecodedJwt();
    return decoded?.header ? JSON.stringify(decoded.header, null, 2) : '';
  }

  payloadSection(): string {
    const decoded = this.currentDecodedJwt();
    return decoded?.payload ? JSON.stringify(decoded.payload, null, 2) : '';
  }

  jwtChanged($event: string) {
    console.log('JWT input changed:', $event);
    this.jwt.set($event);
    this.revalidateJwt();
  }

  signingKeyChanged($event: string) {
    console.log('Signing key changed:', $event);
    this.signingKey.set($event);
    this.revalidateJwt();
  }

  private revalidateJwt() {
    const jwtValue = this.jwt().trim();
    const signingKeyValue = this.signingKey().trim();

    if (!jwtValue) {
      this.currentDecodedJwt.set(null);
      this.decodedJwt.set('');
      return;
    }

    const decoded = this.serviceFacade.decodeJwt(jwtValue, signingKeyValue);

    if (decoded) {
      this.currentDecodedJwt.set(decoded);
      this.decodedJwt.set(JSON.stringify(decoded, null, 2));
    } else {
      this.currentDecodedJwt.set(null);
      this.decodedJwt.set('Invalid JWT');
    }
  }

  clearInput() {
    this.jwt.set('');
    this.signingKey.set('');
    this.decodedJwt.set('');
    this.currentDecodedJwt.set(null);
    this.clearAllTags();
    this.serviceFacade.decodeJwt('', '');
  }

  private clearAllTags() {
    this.tagsMap.forEach(tagSignal => {
      tagSignal.set([]);
    });
  }

  pasteSampleJwt() {
    this.clearAllTags();
    this.jwt.set(exampleEncodedJwt.trim());
    this.signingKey.set(exampleSigningKey.trim());
    this.revalidateJwt();
  }

  copyToClipboard(
    textToCopy: string = this.jwt(),
    mapKey: string = 'encodedJwtInputTags'
  ) {
    const tagsArraySignal =
      this.getTagsArrayFromMap(mapKey) ?? signal<TagData[]>([]);

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

  copyToClipboardWrapper = (value: string, tagMapKey: string) => {
    console.log('Copying:', value, tagMapKey);
    this.copyToClipboard(value, tagMapKey);
  };
}

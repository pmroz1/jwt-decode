import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextAreaComponent } from '@app/shared/components/text-area/text-area.component';
import { exampleEncodedJwt } from '@app/shared/data/example-jwt.data';
import { TagModule } from 'primeng/tag';
import { TagData } from '@features/decode/models/tag.model';
import { SeverityType } from './dictionaries/severity-type.dictionary';

@Component({
  selector: 'app-decode',
  imports: [TextAreaComponent, TagModule],
  template: `
    <div class="flex flex-row items-center min-h-100 h-full">
      <div class="flex flex-col w-1/2 h-full p-4">
        <app-text-area
          class="w-full h-full p-4"
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
  decodedJwt = signal<any>(null);

  inputTags = signal<TagData[]>([
    { value: 'JWT', severity: SeverityType.Info },
    { value: 'Decode', severity: SeverityType.Success },
  ]);
}

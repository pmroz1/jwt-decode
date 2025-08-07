import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextAreaComponent } from '@app/shared/components/text-area/text-area.component';
import { exampleEncodedJwt } from '@app/shared/data/example-jwt.data';

@Component({
  selector: 'app-decode',
  imports: [TextAreaComponent],
  template: `
    <div class="flex flex-row items-center min-h-100 h-full">
      <app-text-area
        class="w-full h-full p-4"
        [inputValue]="jwt()"
        [placeholder]="'Enter JWT here...'"
      ></app-text-area>
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
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-text-area',
  imports: [TextareaModule],
  template: `
    <div
      pTextarea
      id="input-textarea"
      class="w-full min-h-80 h-220 resize-none font-mono text-sm"
      [innerHTML]="inputValue()"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent {
  inputValue = input<any>();
  placeholder = input<string>('Enter data here...');
}

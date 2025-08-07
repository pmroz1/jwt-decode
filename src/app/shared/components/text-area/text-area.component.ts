import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-text-area',
  imports: [TextareaModule],
  template: `
    <textarea
      pTextarea
      id="input-textarea"
      class="{{ defaultClass }} {{ height() }}"
      placeholder="{{ placeholder() }}"
      [value]="inputValue()"
      (input)="readonly() ? null : onInputChange($event)"
    ></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent {
  inputValue = input<any>('');
  readonly = input<boolean>(false);
  placeholder = input<string>('Enter data here...');
  valueChange = output<string>();
  height = input<string>('');
  defaultClass = 'w-full resize-none font-mono text-sm';

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }

  getClass() {
    return `${this.defaultClass} ${this.height() ?? 'h-full'}`;
  }
}

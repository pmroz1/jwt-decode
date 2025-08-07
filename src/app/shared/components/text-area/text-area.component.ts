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
    @if(readonly()) {
    <div
      pTextarea
      id="input-textarea"
      class="w-full min-h-80 h-220 resize-none font-mono text-sm"
      (input)="readonly() ? null : onInputChange($event)"
    >
      {{ inputValue() }}
    </div>
    } @else {
    <textarea
      pTextarea
      id="input-textarea"
      class="w-full min-h-80 h-220 resize-none font-mono text-sm"
      placeholder="{{ placeholder() }}"
      (input)="readonly() ? null : onInputChange($event)"
      >{{ inputValue() }}</textarea
    >}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent {
  inputValue = input<any>();
  readonly = input<boolean>(false);
  placeholder = input<string>('Enter data here...');
  valueChange = output<string>();

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }
}

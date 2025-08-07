import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-decode',
  imports: [],
  template: `<p>decode works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecodeComponent { }

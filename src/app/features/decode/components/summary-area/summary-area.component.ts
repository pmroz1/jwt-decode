import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagData } from '@app/features';
import { TextAreaComponent } from '@app/shared/components/text-area/text-area.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-summary-area',
  imports: [TextAreaComponent, TagModule, ButtonModule],
  template: `
    <div class="flex flex-row items-center justify-between ml-4 mr-4">
      <p class="text-lg font-semibold gap-2">{{ header() }}</p>
      <div class="mb-4 flex flex-wrap gap-2">
        <button pButton severity="secondary" (click)="this.copyFunction()">
          <i class="pi pi-copy" pButtonIcon></i>
          <span pButtonLabel>COPY</span>
        </button>
        @for(tag of tagList(); track $index) {
        <p-tag [value]="tag.value" [severity]="tag.severity"></p-tag>
        }
      </div>
    </div>
    <app-text-area
      class="w-full pt-4"
      [height]="height()"
      [readonly]="true"
      [placeholder]="''"
      [inputValue]="displayValue()"
    ></app-text-area>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryAreaComponent {
  header = input<string>('HEADER');
  tagList = input<TagData[]>([]);
  displayValue = input<string>('');
  height = input<string>('h-80');
  copyFunction = input<(value: string, tags: TagData[]) => void>(() => {
    console.log('Copying:', this.displayValue(), this.tagList());
  });
}

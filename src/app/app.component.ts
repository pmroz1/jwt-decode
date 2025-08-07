import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DecodeComponent } from '@features/decode/decode.component';


@Component({
  selector: 'app-root',
  imports: [ButtonModule, DecodeComponent],
  template: `
    <div class="flex flex-col items-center min-h-screen">
      <h1 class="text-4xl font-bold mb-4 pt-5">Welcome to JWT Decode App</h1>
      <p class="text-lg mb-8">
        This app decodes JWT tokens and displays their contents.
      </p>
      <app-decode class="w-full h-full p-4"></app-decode>
    </div>
  `,
})
export class AppComponent {
  title = 'jwt-decode';
}

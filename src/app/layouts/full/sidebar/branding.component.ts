import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding" style="margin-top: 2rem; margin-bottom: 1rem">
      <a [routerLink]="['/']">
        <img
          src="./assets/images/logos/logo.jpg"
          class="align-middle"
          width="230"
          height="60"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}

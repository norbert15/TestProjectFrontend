import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { DialogsComponent } from './core/components/dialogs/dialogs.component';
import { PopupComponent } from './core/components/popup/popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DialogsComponent, PopupComponent],
  template: `<app-navbar></app-navbar>
    <main>
      <div class="stretch container pt"><router-outlet></router-outlet></div>
    </main>
    <app-dialogs></app-dialogs>
    <app-popup></app-popup>`,
})
export class AppComponent {}

import { Component, computed, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Paths } from '../../constans/paths';
import { LoginFormComponent } from '../../../components/public/login-form/login-form.component';
import { AuthService } from '../../../services/http/auth.service';

type NavbarItemType = {
  routerLink: string;
  label: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LoginFormComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public loginComponent = viewChild<LoginFormComponent>(LoginFormComponent);

  /**
   * Megjelenő navbar elemek/menük
   */
  public navbarItems = computed<NavbarItemType[]>(() => {
    const navbarItems: NavbarItemType[] = [
      { label: 'Diákok', routerLink: Paths.STUDENTS },
    ];

    // Bejelentkezett-e már valaki
    const hasToken = this.isAuthed();

    if (hasToken) {
      navbarItems.push({ label: 'Címek', routerLink: Paths.ADDRESSES });
    }

    return navbarItems;
  });

  /**
   * Van bejelentkezett felhasználó
   */
  public isAuthed = computed<boolean>(() => !!this.authService.accessToken());

  private readonly authService = inject(AuthService);

  public onOpenLoginFormDialog(): void {
    if (this.loginComponent()) {
      this.loginComponent()?.onOpenLoginFormDialogClick();
    }
  }
}

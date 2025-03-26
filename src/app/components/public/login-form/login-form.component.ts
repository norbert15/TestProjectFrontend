import {
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { InputComponent } from '../../reusables/input/input.component';
import { DialogsService } from '../../../services/dialog.service';
import { DialogModel } from '../../../models/dialog.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../reusables/button/button.component';
import { AuthService } from '../../../services/http/auth.service';
import { PopupService } from '../../../services/popup.service';
import { finalize, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
  /**
   * Login form template
   */
  public loginFormTemplate = viewChild<TemplateRef<any>>('loginFormTemplate');

  /**
   * Login form group
   */
  public loginFormGroup!: FormGroup;

  public isLoading = signal(false);

  private readonly authService = inject(AuthService);
  private readonly popupService = inject(PopupService);
  private readonly dialogsService = inject(DialogsService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initForm();
  }

  public onOpenLoginFormDialogClick(): void {
    // Dialog objektum létrehozása
    const newDialog: DialogModel = new DialogModel('Bejelentkezés', {
      content: this.loginFormTemplate(),
    });

    // Dialog megnyitása
    this.dialogsService.addNewDialog(newDialog);

    // Dialog bezáródásának esemény figyelése
    newDialog.dialogClosed$.subscribe({
      complete: () => {
        this.loginFormGroup.reset();
      },
    });
  }

  /**
   * Dialog bezárása
   */
  public onCloseDialogClick(): void {
    this.dialogsService.removeLastOpenedDialog();
  }

  public onLoginSubmit(): void {
    if (this.loginFormGroup.valid) {
      const { username, password } = this.loginFormGroup.getRawValue();
      this.authService
        .login(username, password)
        .pipe(
          take(1),
          finalize(() => this.isLoading.set(false)),
        )
        .subscribe({
          next: (result: { accessToken: string }) => {
            this.authService.setAccessToken(result.accessToken);
            this.onCloseDialogClick();
            this.popupService.add({
              details: 'Sikeres bejelentkezés',
              severity: 'success',
            });
          },
          error: (error: HttpErrorResponse) => {
            const details =
              error.status === 500
                ? 'Hiba történt a bejelentkezés során!'
                : 'A megadott felhasználónév vagy jelszó helytelen!';
            this.popupService.add({ details, severity: 'error' });
          },
        });
    }
  }

  /**
   * Login form inicializálása
   */
  private initForm(): void {
    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}

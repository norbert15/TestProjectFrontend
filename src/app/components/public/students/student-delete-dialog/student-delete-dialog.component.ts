import {
  Component,
  effect,
  inject,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, take } from 'rxjs';

import { DialogsService } from '../../../../services/dialog.service';
import { DialogModel } from '../../../../models/dialog.model';
import { ButtonComponent } from '../../../reusables/button/button.component';
import { StudentService } from '../../../../services/http/student.service';
import { PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'app-student-delete-dialog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './student-delete-dialog.component.html',
  styleUrl: './student-delete-dialog.component.scss',
})
export class StudentDeleteDialogComponent {
  public studentDeleteDialogTemplate = viewChild<TemplateRef<any>>(
    'studentDeleteDialogTemplate',
  );

  /**
   * Diák azonosítója, mely eltávolításra kerül
   */
  public studentId = model<string | null>(null);

  public studentDelete = output<void>();

  /**
   * Az eltávolítás folyamatban van még
   */
  public isLoading = signal(false);

  private readonly dialogsService = inject(DialogsService);
  private readonly studentService = inject(StudentService);
  private readonly popupService = inject(PopupService);

  constructor() {
    effect(
      () => {
        const studentId = this.studentId();

        if (studentId) {
          this.openStudentDeleteDialog();
        }
      },
      { allowSignalWrites: true },
    );
  }

  /**
   * Dialog bezárása
   */
  public closeDialog(): void {
    this.dialogsService.removeLastOpenedDialog();
  }

  /**
   * Diák végleges eltávolítása
   */
  public onDeleteStudentClick(): void {
    if (this.studentId() && !this.isLoading()) {
      this.isLoading.set(true);
      this.studentService
        .deleteStudent(this.studentId()!)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading.set(false);
            this.closeDialog();
          }),
        )
        .subscribe({
          next: () => {
            this.studentDelete.emit();
            this.popupService.add({
              details: 'A diák eltávolítása sikeresen megtörtént',
              severity: 'success',
              title: 'Sikeres művelet!',
            });
          },
          error: (error: HttpErrorResponse) => {
            const details =
              error.status === 404
                ? 'A diák nem található vagy már eltávolításra került'
                : 'A diák eltávolítása során hiba történt';

            this.popupService.add({
              details,
              severity: 'error',
              title: 'Sikertelen művelet!',
            });
          },
        });
    }
  }

  private openStudentDeleteDialog(): void {
    // Új dialog létrehozása
    const newDialog: DialogModel = new DialogModel('Diák eltávolítása', {
      content: this.studentDeleteDialogTemplate(),
    });

    // Dialog megnyitása
    this.dialogsService.addNewDialog(newDialog);

    // Dialog bezáródásának eseményére való feliratkozás
    newDialog.dialogClosed$.subscribe({
      complete: () => {
        this.studentId.set(null);
      },
    });
  }
}

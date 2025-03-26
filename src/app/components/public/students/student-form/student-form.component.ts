import {
  Component,
  inject,
  Input,
  OnInit,
  output,
  Signal,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize, take } from 'rxjs';

import { DialogsService } from '../../../../services/dialog.service';
import { IStudent } from '../../../../models/student.model';
import { DialogModel } from '../../../../models/dialog.model';
import { InputComponent } from '../../../reusables/input/input.component';
import { StudentService } from '../../../../services/http/student.service';
import { PopupService } from '../../../../services/popup.service';
import { ButtonComponent } from '../../../reusables/button/button.component';
import { EMAIL_VALIDATION_REGEX } from '../../../../core/constans/variables';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent implements OnInit {
  /**
   * Diák form template
   */
  public studentFormTemplate = viewChild<TemplateRef<any>>(
    'studentFormTemplate',
  );

  @Input() public set student(student: IStudent | null) {
    this._student.set(student);

    if (student) {
      this.patchStudentValues(student);
      this.onOpenStudentFormDialogClick();
    }
  }

  /**
   * Diák objektum readonly signal obejktuma
   */
  public get student(): Signal<IStudent | null> {
    return this._student.asReadonly();
  }

  /**
   * Diák form dialog bezárásának esemény jelzése
   */
  public studentDialogClose = output<void>();

  /**
   * Diák objektum módosításának/létrehozásának esemény jelzése
   */
  public studentSave = output<void>();

  /**
   * Diák form group
   */
  public studentFormGroup!: FormGroup;

  /**
   * Műveletek folyamatban vannak-e
   */
  public isLoading = signal(false);

  private _student = signal<IStudent | null>(null);

  private readonly dialogsService = inject(DialogsService);
  private readonly studentService = inject(StudentService);
  private readonly popupService = inject(PopupService);

  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initForm();
  }

  /**
   * Klikk esemény kiváltására megnyilik a diák form dialog nézete
   */
  public onOpenStudentFormDialogClick(): void {
    const dialogTitle = this.student()
      ? 'Diák szerkesztése'
      : 'Új diák létrehozása';

    // Dialog létrehozása
    const newDialog: DialogModel = new DialogModel(dialogTitle, {
      content: this.studentFormTemplate(),
    });

    // Új dialog megnyitása
    this.dialogsService.addNewDialog(newDialog);

    /**
     * Dialog bezáródásának eseményére való feliratkozás.
     * A leiratkozás szükségtelen mivel a dialog bezáródás/megsemmisülése után automatikusan leiratkozik róla
     */
    newDialog.dialogClosed$.subscribe({
      complete: () => {
        this.studentFormGroup.reset();
        this.studentDialogClose.emit();
      },
    });
  }

  public onStudentSubmit(): void {
    if (this.studentFormGroup.valid && !this.isLoading()) {
      this.isLoading.set(true);
      // Ha van diák objektumunk akkor szerkesztésre kerül, különben létrehozásra
      if (this.student()) {
        this.updateStudent();
      } else {
        this.createStudent();
      }
    }
  }

  /**
   * Dialog bezárása
   */
  public closeDialog(): void {
    this.dialogsService.removeLastOpenedDialog();
  }

  public validateEmail(
    formControl: FormControl,
  ): Record<string, boolean> | null {
    if (EMAIL_VALIDATION_REGEX.test(formControl.value)) {
      return null;
    }

    return { invalidEmail: true };
  }

  /**
   * Új diák objektum létrehozásának elindítása
   */
  private createStudent(): void {
    const { name, email } = this.studentFormGroup.getRawValue();
    this.studentService
      .createStudent(name, email)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.popupService.add({
            details: 'A diák létrehozása sikeresen megtörtént',
            severity: 'success',
            title: 'Sikeres művelet!',
          });
          this.studentSave.emit();
          this.closeDialog();
        },
        error: () => {
          this.popupService.add({
            details: 'A diák létrehozása során hiba történt',
            severity: 'error',
            title: 'Sikertelen művelet!',
          });
        },
      });
  }

  /**
   * Diák objektum módosításának elindítása
   */
  private updateStudent(): void {
    const { name, email } = this.studentFormGroup.getRawValue();
    const student: IStudent = { name, email, id: this.student()!.id };

    this.studentService
      .updateStudent(student)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.popupService.add({
            details: 'A diák szerkesztése sikeresen megtörtént',
            severity: 'success',
            title: 'Sikeres művelet!',
          });
          this.studentSave.emit();
          this.closeDialog();
        },
        error: (error: HttpErrorResponse) => {
          const details =
            error.status === 404
              ? 'A diák nem található'
              : 'A diák szerkesztése során hiba történt';

          this.popupService.add({
            details,
            severity: 'error',
            title: 'Sikertelen művelet!',
          });
        },
      });
  }

  /**
   * Diák form group-jának inicializálása
   */
  private initForm(): void {
    this.studentFormGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.validateEmail]],
    });
  }

  /**
   * Diák form értékeinek beállítása paraméterben megadott diák objektum alapján
   *
   * @param {IStudent} student diák objektum
   */
  private patchStudentValues(student: IStudent): void {
    this.studentFormGroup.patchValue({
      name: student.name,
      email: student.email,
    });
  }
}

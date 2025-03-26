import { Component, HostBinding, inject, OnInit, signal } from '@angular/core';
import { finalize, take } from 'rxjs';

import { StudentService } from '../../../services/http/student.service';
import { IStudent } from '../../../models/student.model';
import { TableComponent } from '../../reusables/table/table.component';
import { ITableRow, ITableTitle } from '../../../models/table.model';
import { TableOperationEnum } from '../../../core/constans/enums';
import { FadeDirective } from '../../../directives/fade.directive';
import { StudentFormComponent } from './student-form/student-form.component';
import { PopupService } from '../../../services/popup.service';
import { StudentDeleteDialogComponent } from './student-delete-dialog/student-delete-dialog.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    TableComponent,
    StudentFormComponent,
    FadeDirective,
    StudentDeleteDialogComponent,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  /**
   * Diákok táblázatának címei
   */
  public studentTableTitles: ITableTitle<IStudent>[] = [
    { text: '#', order: true },
    { text: 'Diák neve', order: true },
    { text: 'Diák e-mail címe', order: true },
    { text: 'Műveletek' },
  ];

  /**
   * Diákok táblázatának sorai
   */
  public studentTableRows = signal<ITableRow<IStudent>[]>([]);

  /**
   * Kiválasztott diák objektum (szerkesztés)
   */
  public selectedStudent = signal<IStudent | null>(null);

  /**
   * Diák azonosító, mely alapján eltávolításra kerül
   */
  public studentIdForDelete = signal<string | null>(null);

  private limit = 100;
  private plus = 100;

  private fetching = false;

  private readonly studentService = inject(StudentService);
  private readonly popupService = inject(PopupService);

  public ngOnInit(): void {
    this.fetchStudents();
  }

  public onLoadExtraRowsScroll(): void {
    if (this.fetching) {
      return;
    }

    this.fetching = true;
    this.limit += this.plus;
    this.fetchStudents();
  }

  /**
   * Diákok listájának lekérdezése és beállítása
   */
  public fetchStudents(): void {
    this.studentService
      .getAllStudents(this.limit, 0)
      .pipe(
        take(1),
        finalize(() => (this.fetching = false)),
      )
      .subscribe({
        next: (students: IStudent[]) => {
          this.popupService.add({
            details: 'A diákok listájának lekérdezése sikeresen megtörtént!',
            severity: 'success',
          });
          const tableRows = this.buildStudentRows(students);
          this.studentTableRows.set(tableRows.slice());
        },
        error: () => {
          this.popupService.add({
            details: 'A diákok listájának lekérdezése során hiba törént!',
            severity: 'error',
          });
        },
      });
  }

  /**
   * Diákok listájának átalakítása a táblázat sorainak megjelenítésére
   *
   * @param {IStudent[]} students diákok listája
   * @returns {ITableRow<IStudent>[]} átalakított sorok
   */
  private buildStudentRows(students: IStudent[]): ITableRow<IStudent>[] {
    return students.map((student: IStudent, index: number) => ({
      cells: {
        index: { value: index + 1 },
        name: { value: student.name },
        email: { value: student.email },
        settings: {
          operations: [
            {
              name: TableOperationEnum.EDIT,
              triggerFn: (row: ITableRow<IStudent>) =>
                this.selectedStudent.set(row.model!),
            },
            {
              name: TableOperationEnum.DELETE,
              triggerFn: (row: ITableRow<IStudent>) =>
                this.studentIdForDelete.set(row.model!.id),
            },
          ],
        },
      },
      model: student,
    }));
  }

  @HostBinding('class.stretch')
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get classStretch(): boolean {
    return true;
  }
}

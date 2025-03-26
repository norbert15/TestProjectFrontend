import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ReplaySubject, takeUntil } from 'rxjs';

import { IconIds } from '../../constans/enums';
import { DialogModel } from '../../../models/dialog.model';
import { DialogsService } from '../../../services/dialog.service';
import { FadeDirective } from '../../../directives/fade.directive';

@Component({
  selector: 'app-dialogs',
  standalone: true,
  imports: [CommonModule, FadeDirective, MatIcon],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsComponent implements OnInit, OnDestroy {
  public readonly X_CIRCLE_ICON = IconIds.X_CIRCLE;

  public dialog = signal<DialogModel | null>(null);

  private unlisten: (() => void) | null = null;

  private readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dialogsService = inject(DialogsService);
  private readonly renderer = inject(Renderer2);

  public ngOnInit(): void {
    this.fetchLastOpenedDialog();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.dialogsService.clearAll();
  }

  public onCloseClick(): void {
    this.dialogsService.removeLastOpenedDialog();
  }

  private fetchLastOpenedDialog(): void {
    this.dialogsService.dialogs$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (dialogs: DialogModel[]) => {
        const dialog = dialogs[dialogs.length - 1] || null;
        this.dialog.set(dialog);

        if (this.dialog() && !this.unlisten) {
          this.unlisten = this.renderer.listen(
            'document',
            'keydown.escape',
            () => {
              this.dialogsService.removeLastOpenedDialog();
            },
          );
        }

        if (!this.dialog() && this.unlisten) {
          this.unlisten();
          this.unlisten = null;
        }
      },
    });
  }
}

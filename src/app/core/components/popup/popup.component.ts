import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

import { IconIds } from '../../constans/enums';
import { PopupAutoRemoveDirective } from '../../../directives/popup-auto-remove.directive';
import { PopupService, PopupType } from '../../../services/popup.service';

type GroupedPopups = {
  length: number;
  key: string;
} & Pick<PopupType, 'title' | 'severity' | 'details'>;

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, PopupAutoRemoveDirective, MatIcon],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  public readonly ICONS: Record<string, IconIds> = {
    error: IconIds.BAN,
    warning: IconIds.EXCLAMATION_CIRCLE,
    success: IconIds.CHECK_CIRCLE,
    info: IconIds.INFO_CIRCLE,
    close: IconIds.X_CIRCLE,
  };

  public groupedPopups = computed<GroupedPopups[]>(() => {
    const popupGroups = this.popupService.popupGroups();
    const groupedPopups: GroupedPopups[] = [];

    Object.keys(popupGroups).forEach((key) => {
      const popups = popupGroups[key];
      const popup = popups[0];
      groupedPopups.push({
        key: key,
        length: popups.length,
        details: popup.details,
        severity: popup.severity,
        title: popup.title,
      });
    });

    return groupedPopups;
  });

  private readonly popupService = inject(PopupService);

  public onClosePopupClick(key: string): void {
    this.popupService.close(key);
  }
}

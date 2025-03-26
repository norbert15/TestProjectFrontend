import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IconIds } from '../core/constans/enums';

@Injectable({
  providedIn: 'root',
})
export class IconsRegisterService {
  private readonly DEFAULT_PATH = 'assets/images/icons';

  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  public registerCustomIcons(): void {
    const iconsForRegister: { iconId: IconIds; svgPath: string }[] = [
      {
        iconId: IconIds.PENCIL_SQUARE,
        svgPath: `${this.DEFAULT_PATH}/pencil-square.svg`,
      },
      {
        iconId: IconIds.X_CIRCLE,
        svgPath: `${this.DEFAULT_PATH}/x-circle.svg`,
      },
      { iconId: IconIds.EYE, svgPath: `${this.DEFAULT_PATH}/eye.svg` },
      {
        iconId: IconIds.CHECK_CIRCLE,
        svgPath: `${this.DEFAULT_PATH}/check-circle.svg`,
      },
      { iconId: IconIds.TRASH, svgPath: `${this.DEFAULT_PATH}/trash.svg` },
      {
        iconId: IconIds.EYE_SLASH,
        svgPath: `${this.DEFAULT_PATH}/eye-slash.svg`,
      },
      {
        iconId: IconIds.BAN,
        svgPath: `${this.DEFAULT_PATH}/ban.svg`,
      },
      {
        iconId: IconIds.EXCLAMATION_CIRCLE,
        svgPath: `${this.DEFAULT_PATH}/exclamation-circle.svg`,
      },
      {
        iconId: IconIds.INFO_CIRCLE,
        svgPath: `${this.DEFAULT_PATH}/info-circle.svg`,
      },
    ];

    for (const icon of iconsForRegister) {
      this.iconRegistry.addSvgIcon(
        icon.iconId,
        this.sanitizer.bypassSecurityTrustResourceUrl(icon.svgPath),
      );
    }
  }
}

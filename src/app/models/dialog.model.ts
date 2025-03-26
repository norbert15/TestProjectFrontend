import { signal, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

type Size = 'normal' | 'small' | 'medium' | 'large';

type DialogSettingsType = {
  content?: TemplateRef<any>;
  size?: Size;
};

export class DialogModel {
  public title: string;
  public size: Size;
  public content: TemplateRef<any> | undefined;

  public triggerIsLoading = signal(false);

  private readonly _dialogClosed$ = new Subject<void>();
  public readonly dialogClosed$ = this._dialogClosed$.asObservable();

  constructor(title: string, settings: DialogSettingsType | null = null) {
    this.title = title;
    this.content = settings?.content;
    this.size = settings?.size ?? 'small';
  }

  public closeDialog(): void {
    this._dialogClosed$.next();
    this._dialogClosed$.complete();
  }
}

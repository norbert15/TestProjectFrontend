import { Component, inject, model, output } from '@angular/core';
import { InputComponent } from '../../../reusables/input/input.component';
import { ButtonComponent } from '../../../reusables/button/button.component';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../../services/http/address.service';
import { take } from 'rxjs';
import { PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [InputComponent, ButtonComponent, FormsModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  /**
   * Cím értéke
   */
  public address = model('');

  public addressCreate = output<void>();

  private readonly addressService = inject(AddressService);
  private readonly popupService = inject(PopupService);

  /**
   * Új cím létrehozása, vagy random cím generálása függően a paraméterben átadott értéktől
   *
   * @param {boolean} generated alapértelmezetten false, true esetén random generál a rendszer egy címet
   */
  public onCreateAddressClick(generated = false): void {
    if (this.address() || generated) {
      this.addressService
        .createAddress(generated ? '' : this.address())
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.popupService.add({
              details: 'A cím létrehozása sikeresen megtörtént',
              severity: 'success',
              title: 'Sikeres művelet!',
            });
            this.addressCreate.emit();
            this.address.set('');
          },
          error: () => {
            this.popupService.add({
              details: 'A cím létrehozása során hiba történt',
              severity: 'error',
              title: 'Sikertelen művelet!',
            });
          },
        });
    }
  }
}

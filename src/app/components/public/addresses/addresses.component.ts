import { Component, HostBinding, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../reusables/table/table.component';
import { AddressService } from '../../../services/http/address.service';
import { finalize, take } from 'rxjs';
import { IAddress } from '../../../models/address.model';
import { PopupService } from '../../../services/popup.service';
import { ITableRow, ITableTitle } from '../../../models/table.model';
import { FadeDirective } from '../../../directives/fade.directive';
import { AddressFormComponent } from './address-form/address-form.component';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [TableComponent, FadeDirective, AddressFormComponent],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss',
})
export class AddressesComponent implements OnInit {
  /**
   * Címek táblázatának címei
   */
  public addressTableTitles: ITableTitle[] = [
    { text: '#', order: true },
    { text: 'Cím', order: true },
  ];

  /**
   * Címek táblázatának sorai
   */
  public addressTableRows = signal<ITableRow<IAddress>[]>([]);

  private limit = 100;
  private plus = 100;
  private fetching = false;

  private readonly addressService = inject(AddressService);
  private readonly popupService = inject(PopupService);

  public ngOnInit(): void {
    this.fetchAddresses();
  }

  public onLoadExtraRowsScroll(): void {
    if (this.fetching) {
      return;
    }

    this.fetching = true;
    this.limit += this.plus;
    this.fetchAddresses();
  }

  /**
   * Címek listájának lekérdezése és beállítása
   */
  public fetchAddresses(): void {
    this.addressService
      .getAllAddresses(this.limit, 0)
      .pipe(
        take(1),
        finalize(() => (this.fetching = false)),
      )
      .subscribe({
        next: (addresses: IAddress[]) => {
          this.popupService.add({
            details: 'A címek lekérdezése sikeresen megtörtént!',
            severity: 'success',
          });

          const tableRows = this.buildAddressTableRows(addresses);
          this.addressTableRows.set(tableRows.slice());
        },
        error: () => {
          this.popupService.add({
            details: 'A címek lekérdezése során hiba történt!',
            severity: 'error',
          });
        },
      });
  }

  /**
   * Címek listájának átalakítása a táblázat sorainak megjelenítésére
   *
   * @param {IAddress[]} addresses címek listája
   * @returns {ITableRow<IAddress>[]} átalakított sorok
   */
  private buildAddressTableRows(addresses: IAddress[]): ITableRow<IAddress>[] {
    return addresses.map((address: IAddress, index: number) => ({
      cells: {
        index: { value: index + 1 },
        address: { value: address.address },
      },
      model: address,
    }));
  }

  @HostBinding('class.stretch')
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get classStretch(): boolean {
    return true;
  }
}

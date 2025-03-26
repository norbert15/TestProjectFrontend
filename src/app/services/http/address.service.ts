import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddress } from '../../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  /**
   * Címek api base url-je
   */
  private readonly addressBaseUrl = `${environment.apiUrl}/addresses`;

  /**
   * Http client injectálása
   */
  private readonly httpClient = inject(HttpClient);

  /**
   * Címek listájának lekérdezése
   *
   * @returns {Observable<IAddress[]>}
   */
  public getAllAddresses(
    limit: number,
    offset: number,
  ): Observable<IAddress[]> {
    const params = new HttpParams().appendAll({ limit, offset });
    return this.httpClient.get<IAddress[]>(`${this.addressBaseUrl}/list`, {
      params,
    });
  }

  /**
   * Új cím létrehozása paraméterben megadott cím alapján új cím kerül létrehozásra,
   * amennyiben üres marad (null, undefined) random cím kerül generálásra
   *
   * @param {string} address új cím
   * @returns {Observable<IAddress>}
   */
  public createAddress(address?: string): Observable<IAddress> {
    return this.httpClient.post<IAddress>(`${this.addressBaseUrl}/create`, {
      address,
    });
  }
}

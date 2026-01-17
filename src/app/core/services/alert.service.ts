import { Injectable } from '@angular/core';

/**
 * Service to handle alerts with lazy loading of SweetAlert2
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private swalPromise: Promise<typeof import('sweetalert2').default> | null =
    null;

  /**
   * Lazy load SweetAlert2 and cache the promise
   */
  private async getSwal() {
    if (!this.swalPromise) {
      this.swalPromise = import('sweetalert2').then((module) => module.default);
    }
    return this.swalPromise;
  }

  /**
   * Show an alert using SweetAlert2
   */
  async fire(options: import('sweetalert2').SweetAlertOptions) {
    const Swal = await this.getSwal();
    return Swal.fire(options);
  }

  /**
   * Close any open alert
   */
  async close() {
    const Swal = await this.getSwal();
    Swal.close();
  }
}

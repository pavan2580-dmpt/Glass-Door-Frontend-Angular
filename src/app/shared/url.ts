import { environment } from '../../environments/environment';

export class ApplicationURLs {
  serverUrl = environment.apiURL;
  get admin() {
    return this.serverUrl + 'admin/';
  }
  get sales() {
    return this.serverUrl + 'product/';
  }
  get bills() {
    return this.serverUrl + 'bill/';
  }
  get purchased() {
    return this.serverUrl + 'purchased/';
  }
}
export const applicationUrls = new ApplicationURLs();

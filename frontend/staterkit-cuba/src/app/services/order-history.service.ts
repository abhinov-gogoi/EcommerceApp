import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.ecommerceApiUrl + "/orders"

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseUserHistory> {
    // build URL based on customer url
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`
    return this.httpClient.get<GetResponseUserHistory>(orderHistoryUrl)
  }
}

interface GetResponseUserHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}

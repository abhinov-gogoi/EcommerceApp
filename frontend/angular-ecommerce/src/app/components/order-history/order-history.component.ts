import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;
  theEmail: string = "";

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    // read user email from browser storage
    this.theEmail = JSON.parse(this.storage.getItem("userEmail"));

    // retrive data from the service
    this.orderHistoryService.getOrderHistory(this.theEmail).subscribe(
      data => this.orderHistoryList = data._embedded.orders
    )
  }

}

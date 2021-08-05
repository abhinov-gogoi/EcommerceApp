import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // subjects are subscribe-able. These values get automatically updated to all subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage; // session storage loses data on tab/browser close
  storage: Storage = localStorage;
  constructor() {
    // read data from the storge
    let data = JSON.parse(this.storage.getItem("cartItems"));

    if(data != null) {
      this.cartItems = data;
      // compute totals based on data read from storage
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

  addToCart(theCartItem: CartItem) {

    // check if we alreadt have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem;

    if(this.cartItems.length > 0) {
      // find the item in our cart based on item id
      for(let tempCartItem of this.cartItems) {
        if(tempCartItem.id === theCartItem.id) {
          alreadyExistsInCart = true;
          existingCartItem = tempCartItem;
          break;
        }
      }
    }

    // check if we found it
    // console.log(alreadyExistsInCart)

    if(alreadyExistsInCart) {
      // increment the quantity of the existing cart item
      existingCartItem.quantity++;
    }
    else {
      // push the item to the array of cartItems
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity <= 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id)

    // if found remove the item from the array
    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish these new values ... all subscribes will receive this new data ASAP
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`------------------  CART DATA  --------------------`)
    for(let tempCartItem of this.cartItems) {
      console.log(`name: ${tempCartItem.name} | quantity: ${tempCartItem.quantity} | unitPrice: ${tempCartItem.unitPrice} | subTotalPrice: ${tempCartItem.unitPrice*tempCartItem.quantity}`)
    }
    console.log(`TOTAL-PRICE: ${totalPriceValue.toFixed(2)} | TOTAL-QUANTITY: ${totalQuantityValue}`)
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/Country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/State';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { EcommerceFormService } from 'src/app/services/ecommerce-form.service';
import { EcommerceValidators } from 'src/app/validators/EcommerceValidators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice = 0.00;
  totalQuantity = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  sameAddress: Boolean = true;

  storage: Storage = sessionStorage;

  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9._]+\\.[a-z]{2,4}$'

  constructor(private formBuilder: FormBuilder,
              private ecommerceFormService: EcommerceFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    // read the users email from browser storage
    const theEmail = JSON.parse(this.storage.getItem("userEmail"));

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        lastName:  new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern(this.emailRegex)])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), EcommerceValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{16}")]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]{3}")]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    })

    // populate credit card months - subscribe to EcommerceFormService
    const startMonth: number = new Date().getMonth() + 1;
    this.ecommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )

    // populate credit card years - subscribe to EcommerceFormService
    this.ecommerceFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )

    // populate countries
    this.ecommerceFormService.getCountries().subscribe(
      data => this.countries = data
    );
  }

  reviewCartDetails() {
    // subscribe to cart service for total price and total quantity
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
    data => this.totalQuantity = data
    );
  }

  onSubmit() {

    if(this.sameAddress){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    }

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create order items from cart items
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = shippingState.name
    purchase.shippingAddress.country = shippingCountry.name

    // populate purchase - billing
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingState.name
    purchase.billingAddress.country = billingCountry.name

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call Rest API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received. \nOrder Tracking Number is ${response.orderTrackingNumber}`);
          // reset the cart
          this.resetCart();
        },
        error: error => {
          alert(`There was an error. ${error.message}`);
        }
      }
    );
    console.log("PURCHASE CLICKED: "+purchase)
  }

  resetCart() {
    // reset cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form
    this.checkoutFormGroup.reset;

    // navigate back to products page
    this.router.navigateByUrl("/products")
  }

 copyShippingAddressToBillingAddress(event) {
    if(event.target.checked) {
      this.sameAddress = true;
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value)
      //bugfix code
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.sameAddress = false;
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = +creditCardFormGroup.value.expirationYear;

    // if the current year equals selected year, start with current month
    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.ecommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
  }

  getStates(addressType: string) {
    const formGroup = this.checkoutFormGroup.get(addressType);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`addressType Selected = ${addressType}`)

    // call ecommerce form service to get states based on country code
    this.ecommerceFormService.getStates(countryCode).subscribe(
        data => {
          // console.log(JSON.stringify(data))
          if(addressType === "shippingAddress") {
            this.shippingAddressStates = data
          } else if(addressType === "billingAddress") {
            this.billingAddressStates = data
          }
        }
    );
  }

  // getters for form validation - to access the form control from HTML
  get firstName() {return this.checkoutFormGroup.get("customer.firstName")}
  get lastName() {return this.checkoutFormGroup.get("customer.lastName")}
  get email() {return this.checkoutFormGroup.get("customer.email")}

  get shippingAddressStreet() {return this.checkoutFormGroup.get("shippingAddress.street")}
  get shippingAddressCity() {return this.checkoutFormGroup.get("shippingAddress.city")}
  get shippingAddressState() {return this.checkoutFormGroup.get("shippingAddress.state")}
  get shippingAddressCountry() {return this.checkoutFormGroup.get("shippingAddress.country")}
  get shippingAddressZipCode() {return this.checkoutFormGroup.get("shippingAddress.zipCode")}

  get billingAddressCity() {return this.checkoutFormGroup.get("billingAddress.city")}
  get billingAddressStreet() {return this.checkoutFormGroup.get("billingAddress.street")}
  get billingAddressState() {return this.checkoutFormGroup.get("billingAddress.state")}
  get billingAddressCountry() {return this.checkoutFormGroup.get("billingAddress.country")}
  get billingAddressZipCode() {return this.checkoutFormGroup.get("billingAddress.zipCode")}

  get creditCardType() {return this.checkoutFormGroup.get("creditCard.cardType")}
  get creditCardNameOnCard() {return this.checkoutFormGroup.get("creditCard.nameOnCard")}
  get creditCardNumber() {return this.checkoutFormGroup.get("creditCard.cardNumber")}
  get creditCardSecurityCode() {return this.checkoutFormGroup.get("creditCard.securityCode")}
}


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/Country';
import { State } from 'src/app/common/State';
import { EcommerceFormService } from 'src/app/services/ecommerce-form.service';

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

  constructor(private formBuilder: FormBuilder, private ecommerceFormService: EcommerceFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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

  onSubmit() {
    if(this.sameAddress){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    }
    console.log("clicked SUBMIT")
    console.log(this.checkoutFormGroup.value)
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
}

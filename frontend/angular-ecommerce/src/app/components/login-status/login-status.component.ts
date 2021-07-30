import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean;
  userFullName: string;
  storage: Storage = sessionStorage;
  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {
    // subscribe to authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    if(this.isAuthenticated) {
      // fetch the loggedin user's details

      // user full name is exposed as property name
      this.oktaAuthService.getUser().then(
        (response) => {
          this.userFullName = response.name;
          const theEmail = response.email;

          // store the email in browser storage
          this.storage.setItem("userEmail", JSON.stringify(theEmail));
        }
      )

    }
  }

  logout() {
    // terminate session with okta and remove current tokens
    this.oktaAuthService.signOut();
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Country } from '../common/Country';
import { State } from '../common/State';

@Injectable({
  providedIn: 'root'
})
export class EcommerceFormService {

  private countriesUrl: string = environment.ecommerceApiUrl + "/countries";
  private stateUrl: string = environment.ecommerceApiUrl + "/states"

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for month dropdown list
    // -- start at current month and loop until
    for(let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // build an array for year dropdown list
    // -- start at current year and loop until next 10 years
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchUrl: string = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    )
  }
}

interface GetResponseCountries {
  _embedded : {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded : {
    states: State[];
  }
}

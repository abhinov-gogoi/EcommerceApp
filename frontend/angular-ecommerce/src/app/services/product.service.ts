import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/Product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseURL: string = "http://localhost:8080/api/products"

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build the URL based on category id
    const searchURL = `${this.baseURL}/search/findByCategoryId?id=${theCategoryId}`

    return this.httpClient.get<ApiResponse>(searchURL).pipe(
      map(response => response._embedded.products)
    )
  }
}

interface ApiResponse {
  _embedded: {
    products: Product[];
  }
}

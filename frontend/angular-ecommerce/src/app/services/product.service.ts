import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/Product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/ProductCategory';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseURL: string = "http://localhost:8080/api/products";
  private categoryURL: string = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {
    // need to build the URL based on category id
    const searchURL = `${this.baseURL}/search/findByCategoryId?id=${theCategoryId}`

    return this.httpClient.get<GetResponseProducts>(searchURL).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryURL).pipe(
      map(response => response._embedded.productCategory)
    )
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/Product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/ProductCategory';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseURL: string = environment.ecommerceApiUrl
  private categoryURL: string = environment.ecommerceApiUrl + "/product-category";

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    // need to build the URL based on product id from param
    const productURL = `${this.baseURL}/products/${theProductId}`
    return this.httpClient.get<Product>(productURL);
  }

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    // need to build the URL based on category id, page and size
    // http://localhost:8080/api/products/search/findByCategoryId?id=1&page=2&size=5
    const searchURL = `${this.baseURL}/products/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProducts>(searchURL);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    // need to build the URL based on category id
    const searchURL = `${this.baseURL}/products/search/findByCategoryId?id=${theCategoryId}`
    return this.getProducts(searchURL);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    // need to build the URL based on keyword entered by user
    const searchURL = `${this.baseURL}/products/search/findByNameContaining?name=${theKeyword}`
    return this.getProducts(searchURL);
  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {
    // need to build the URL based on keyword, page and size
    const searchURL = `${this.baseURL}/products/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProducts>(searchURL);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryURL).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  private getProducts(searchURL: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchURL).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

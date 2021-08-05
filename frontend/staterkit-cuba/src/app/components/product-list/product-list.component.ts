import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { Product } from '../../common/Product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-template.component.html',
  styleUrls: ['./product-list-template.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Products';
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 6;
  theTotalElements: number = 0;

  previousKeyword: string = "";


  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword") ? true : false;
    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // if we have a different keyword than previous, reset pagenumber to 1
    if(this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;

    // now search for products using the given keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1, this.thePageSize, theKeyword).subscribe(this.processResult())
  }

  handleListProducts() {
    // check if 'id' param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      // get the 'id' param string. convert string into number using + symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      // get the 'name' param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    //
    // Check if we have a different category than the previous
    // Note : Angular will reuse a component if its currently being viewed
    // So, pageNumber may not be updated here (reset to 1) while switching betn diff categories
    //

    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    // console.log(`currentCategoryId=${this.currentCategoryId} | pageNumber= ${this.thePageNumber}`)

    // get the products for this category id
    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult())
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageSize = data.page.size;
      this.thePageNumber = data.page.number+1;
      this.theTotalElements = data.page.totalElements;
      // console.log(`pageSize=${this.thePageSize} | pageNumber=${this.thePageNumber} | totalElements=${this.theTotalElements}`)
    }
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`adding To Cart: ${theProduct.name}`)

    const cartItem = new CartItem(theProduct)
    this.cartService.addToCart(cartItem);
  }

}

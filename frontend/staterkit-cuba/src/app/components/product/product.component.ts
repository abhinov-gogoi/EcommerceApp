import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/Product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
// import { QuickViewComponent } from "../quick-view/quick-view.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public openSidebar: boolean = false;
  public listView: boolean = false;
  public col: string = '3';

  // @ViewChild("quickView") QuickView: QuickViewComponent;

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Products';
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 8;
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
    console.log("hasCategoryId " + hasCategoryId)

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








  // ------------------------FROM CUBA--------------------------

  sidebarToggle() {
    this.openSidebar = !this.openSidebar;
    this.col = '3';
  }

  toggleListView(val) {
    this.listView = val;
  }

  gridColumn(val) {
    this.col = val;
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = 'Products';
  searchMode: boolean = false;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

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
    // now search for products using the given keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {
    // check if 'id' param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      // get the 'id' param and convert it into number using + symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      // get the 'name' param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // get the products for this category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}

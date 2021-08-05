import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/ProductCategory';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    // console.log("called from menu component")
    this.productService.getProductCategories().subscribe(
      data => {
        // console.log("Product categories"+ JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

  onClick(productCategory: any) {
    // console.log("CLICK called from menu component")
    // console.log(productCategory)
    this.router.navigateByUrl(`/category/${productCategory.id}/${productCategory.categoryName}`)
  }

}

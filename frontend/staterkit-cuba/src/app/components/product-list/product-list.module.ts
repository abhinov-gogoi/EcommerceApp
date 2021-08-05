import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProductListRoutingModule
  ],
  declarations: [ProductListComponent]
})
export class ProductListModule { }

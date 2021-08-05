import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ShopPageRoutingModule } from './shop-page-routing.module';
import { ShopPageComponent } from './shop-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ShopPageRoutingModule
  ],
  declarations: [ShopPageComponent]
})
export class ShopPageModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopPageComponent } from './shop-page.component';

const routes: Routes = [
  {
    path: '',
    component: ShopPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopPageRoutingModule { }

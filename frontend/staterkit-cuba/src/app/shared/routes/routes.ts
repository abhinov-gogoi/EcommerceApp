import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path: 'sample-page',
    loadChildren: () => import('../../components/sample/sample.module').then(m => m.SampleModule)
  },
  {
    path: 'shop-page',
    loadChildren: () => import('../../components/shop-page/shop-page.module').then(m => m.ShopPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('../../components/product-list/product-list.module').then(m => m.ProductListModule)
  }
];

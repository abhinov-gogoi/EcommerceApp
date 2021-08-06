import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path: 'sample',
    loadChildren: () => import('../../components/sample/sample.module').then(m => m.SampleModule)
  },
  {
    path: 'shop-page',
    loadChildren: () => import('../../components/shop-page/shop-page.module').then(m => m.ShopPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('../../components/product-list/product-list.module').then(m => m.ProductListModule)
  },
  {
    path: 'product',
    loadChildren: () => import('../../components/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'products/:id',
    loadChildren: () => import('../../components/product-details/product-details.module').then(m => m.ProductDetailsModule)
  },
  {
    path: 'category/:id/:name',
    loadChildren: () => import('../../components/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'search/:keyword',
    loadChildren: () => import('../../components/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('../../components/cart-page/cart-page.module').then(m => m.CartPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('../../components/checkout/checkout.module').then(m => m.CheckoutModule)
  }
];

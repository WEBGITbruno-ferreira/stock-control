import { ProductsHomeComponent } from './page/products-home/products-home.component';
import { Component } from '@angular/core';
import { Routes } from "@angular/router";

export const PRODUCTS_ROUTES: Routes = [
  { path : '', component: ProductsHomeComponent}
]

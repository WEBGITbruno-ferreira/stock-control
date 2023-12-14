import { GetAllProductsResponse } from './../../../../models/interfaces/products/response/GetAllProductsResponse';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {

  @Input() products : Array<GetAllProductsResponse> = [];

  public productSelected !: GetAllProductsResponse
}

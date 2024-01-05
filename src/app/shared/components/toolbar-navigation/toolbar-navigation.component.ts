import { ProductEvent } from 'src/app/models/enums/productEvent';
import { ProductFormComponent } from './../../../modules/products/components/product-form/product-form.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html'

})
export class ToolbarNavigationComponent {
  constructor(
    private cookie : CookieService,
    private router : Router,
    private dialogService : DialogService
  ){}

  handleLogout() : void {
    this.cookie.delete('USER_INFO')
    this.router.navigate(['/home'])
  }

  handleSaleProduct(): void {
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT
    this.dialogService.open(ProductFormComponent, {
      header: saleProductAction,
      width: '70%',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 1000,
      maximizable: true,
      data: {
        event: {action : saleProductAction}
      }
    })
  }
}

import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { MessageService } from 'primeng/api';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html'

})
export class DashboardHomeComponent implements OnInit, OnDestroy {

  public productsList: Array<GetAllProductsResponse> =[]
  private  destroy$ = new Subject<void>()

  constructor(
    private productsService : ProductsService,
    private messageService : MessageService,
    private productsDataTransferService : ProductsDataTransferService
  ){}

  ngOnInit(): void {
    this.getProductsDatas();
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getProductsDatas(): void {
      this.productsService.getAllProducts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next : (resp) => {
          if(resp.length > 0){
            this.productsList = resp
           //console.log('product list', this.productsList)
           this.productsDataTransferService.setProductsDatas(this.productsList)
          }

        },
        error : (err) => {
          console.log(err)
          this.messageService.add({
            severity : 'error',
            summary : "Erro",
            detail: 'Erro ao buscar produtos'
          })
        }
      })
  }
}

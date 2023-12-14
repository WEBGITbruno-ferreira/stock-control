import { EventAction } from './../../../../models/interfaces/products/event/EventAction';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from './../../../../models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from './../../../../services/products/products.service';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',

})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public productsData : Array<GetAllProductsResponse> = []


  constructor(
    private productsService : ProductsService,
    private productsDataTransferService : ProductsDataTransferService,
    private router : Router,
    private messageService : MessageService
  ){}


  ngOnInit(): void {
    this.getServiceProductDatas()
  }


  getServiceProductDatas() {
    const productsLoaded = this.productsDataTransferService.getProductsDatas()

    if(productsLoaded.length > 0){
        this.productsData = productsLoaded
    } else {
      this.getAPIProductsDatas()
    }

    console.log("productsData", this.productsData)
  }

  getAPIProductsDatas() {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next : (response) => {
        if(response.length > 0){
          this.productsData = response

        }

      },
      error : (err) => {
          console.log(err)
          this.messageService.add({
            severity : 'error',
            summary: 'Erro',
            detail : 'Erro ao buscar produtos',
            life: 2500
          })
          this.router.navigate(['/dashboard'])

      }
    })
  }

  handleProductAction(event : EventAction): void{
    console.log("event",event)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }

}

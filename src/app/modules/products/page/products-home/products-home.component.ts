import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeleteProductAction } from './../../../../models/interfaces/products/event/DeleteProductAction';
import { EventAction } from './../../../../models/interfaces/products/event/EventAction';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GetAllProductsResponse } from './../../../../models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from './../../../../services/products/products.service';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',

})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public productsData : Array<GetAllProductsResponse> = []

  private ref!: DynamicDialogRef


  constructor(
    private productsService : ProductsService,
    private productsDataTransferService : ProductsDataTransferService,
    private router : Router,
    private messageService : MessageService,
    private confirmationService : ConfirmationService,
    private dialogService: DialogService
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

    if(event){
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event.action,
        width: '70%',
        contentStyle: {overflow : 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productsData: this.productsData
        }
      })

      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next : (resp)=>{
          this.getAPIProductsDatas()
        }
      })
    }
  }

  //rever tipagem

  handleDeleteProductAction(event : DeleteProductAction): void{
    console.log("event",event)
    this.confirmationService.confirm({
      message : `Confirma a exclusão do produto: ${event.productName}?`,
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.deleteProduct(event.product_id)
    })
  }

  deleteProduct(product_id: string) {
    this.productsService.deleteProduct(product_id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next : (response) => {
        if(response){
          this.messageService.add({
            severity: 'success',
            summary: 'sucesso',
            detail: 'Produto removido com sucesso',
            life: 2500

          })

          this.getAPIProductsDatas();
        }
      }, error : (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao remover o produto',
          life: 2500

        })
      }


    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }

}

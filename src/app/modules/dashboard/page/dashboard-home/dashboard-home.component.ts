import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { MessageService } from 'primeng/api';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js/dist/types/index';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html'

})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private  destroy$ = new Subject<void>()


  public productsList: Array<GetAllProductsResponse> =[]
  public productsChartDatas !: ChartData
  public productsChartOptions!: ChartOptions

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
           this.setProductsChartConfig()
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


  setProductsChartConfig(): void {
    //faltou um IF aqui com productList.length
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color')
    const textColorSencondary = documentStyle.getPropertyValue('--text-color-secondary');

    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

    this.productsChartDatas = {
      labels: this.productsList.map( (element) => element?.name ),
      datasets: [
        {
          label: "Quantidade",
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor : documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.productsList.map( (element) => element?.amount)
        }
      ]
    };

    this.productsChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },

      scales: {
        x : {
          ticks : {
            color: textColorSencondary,
            font: {
              weight: 'bolder',
            },

          },
          grid :{
            color: surfaceBorder
          }

        },
        y : {
          ticks : {
            color: textColorSencondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }

    }
  }
}

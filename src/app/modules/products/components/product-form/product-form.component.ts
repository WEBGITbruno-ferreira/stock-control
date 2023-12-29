import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from './../../../../services/products/products.service';
import { CreateProductRequest } from './../../../../models/interfaces/products/request/CreateProductRequest';
import { GetCategoriesResponse } from './../../../../models/interfaces/categories/responses/GetCategoriesResponse';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { ProductEvent } from 'src/app/models/enums/productEvent';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject()
  public productAction !: { event : EventAction, productsData : Array<GetAllProductsResponse>}
  public productSelectedData !: GetAllProductsResponse

  productDatas : Array<GetAllProductsResponse> =[]
  public selectedCategorie: Array<{name : string, code: string}> =[]
  public categoriesDatas: Array<GetCategoriesResponse> = []
  public addProductForm = this.formBuilder.group({
    name : ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount : [0, Validators.required],
  })

  public editProductForm = this.formBuilder.group({
    name : ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],

    amount : [0, Validators.required],
    category_id: ['', Validators.required]

  })

  public saleProductForm = this.formBuilder.group({
    amount : [0, Validators.required],
    product_id: ['', Validators.required],
  })

  public saleProductSelected !: GetAllProductsResponse;
  public renderDropdown = false

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT

  constructor(
    private categoriesService : CategoriesService,
    private formBuilder : FormBuilder,
    private messageService : MessageService,
    private router : Router,
    private productsService : ProductsService,
    private ref: DynamicDialogConfig,
    private productsDataTransferService : ProductsDataTransferService
  ){}


  ngOnInit(): void {
    this.getAllCategories()
    this.productAction = this.ref.data

    if(this.productAction.event.action === this.saleProductAction ) {
      this.getProductDatas()
    }

    this.renderDropdown = true
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getAllCategories() {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next : (response) => {
        if(response.length > 0) {
        this.categoriesDatas = response
            if(this.productAction.event.action === this.editProductAction && this.productAction.productsData){
              this.getProductSelectedData(this.productAction.event.id as string)
            }
        }
      }
    })
  }

  handleSubmitAdd() : void {
    if(this.addProductForm.value && this.addProductForm.valid){
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      }

      this.productsService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next : (response) => {
          if(response){
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso.',
              life: 2500

            })
          }
        }, error : (err) => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto',
            life: 2500

          })
        }
      })
    }

    this.addProductForm.reset()
  }

  handleSubmitEdit(): void {
    if(this.editProductForm.value && this.editProductForm.valid) {
        const requestEditProduct: EditProductRequest = {
          name: this.editProductForm.value.name as string,
          price: this.editProductForm.value.price as string,
          description: this.editProductForm.value.description as string,
          product_id: this.productAction?.event?.id as string,
          amount: this.editProductForm.value.amount as number,
          category_id: this.editProductForm.value.category_id as string
        }

        this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next : (response) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Editado com sucesso',
                life: 2500
            });

            this.editProductForm.reset()
          }, error : (err) => {

            console.log(err)
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar',
              life: 2500
          });

          this.editProductForm.reset()
          }
        })
    }
  }

  getProductSelectedData(productID : string) : void {
    const allProducts = this.productAction?.productsData
    alert('x')
    if(allProducts.length > 0){
      const productFiltered = allProducts.filter( item => item.id === productID)

      if (productFiltered) {
        this.productSelectedData = productFiltered[0]
        this.editProductForm.setValue({
          name: this.productSelectedData.name,
          price: this.productSelectedData.price,
          description: this.productSelectedData.description,
          amount: this.productSelectedData.amount,
          category_id: this.productSelectedData.category.id
        })
      }
    }
  }


  getProductDatas(): void {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next : (response) => {
        if(response.length > 0){
            this.productDatas = response
            this.productDatas && this.productsDataTransferService.setProductsDatas(this.productDatas)
        }
      }
    })
  }
}

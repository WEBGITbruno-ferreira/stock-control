import { GetCategoriesResponse } from './../../../../models/interfaces/categories/responses/GetCategoriesResponse';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject()

  public selectedCategorie: Array<{name : string, code: string}> =[]
  public categoriesDatas: Array<GetCategoriesResponse> = []
  public addProductForm = this.formBuilder.group({
    name : ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount : [0, Validators.required],
  })

  constructor(
    private categoriesService : CategoriesService,
    private formBuilder : FormBuilder,
    private messageService : MessageService,
    private router : Router,
  ){}


  ngOnInit(): void {
    this.getAllCategories()
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
        }
      }
    })
  }

  handleSubmitAdd() : void {

  }
}

import { EditCategoryAction } from './../../../../models/interfaces/categories/event/EditCategoryAction';
import { CategoryEvent } from './../../../../models/enums/categories/CategorieEvent';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION

  public categoryAction !: { event : EditCategoryAction}
  public categoryForm = this.formBuilder.group({
    name : ['', Validators.required]
  })

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder : FormBuilder,
    private messageService : MessageService,
    private categoriesService : CategoriesService

  ){

  }

  ngOnInit(): void {

  }

  handleSubmitAddCategory() : void {
      if(this.categoryForm.value && this.categoryForm.valid){
        const requestCreateCategory : { name : string} = {
          name : this.categoryForm.value.name as string
        }

        this.categoriesService.createNewCategoty(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next : (resp) => {
            if(resp){
              this.categoryForm.reset()
              this.messageService.add({
                severity : 'success',
                summary: 'Sucesso',
                detail : 'Criada com sucesso',
                life : 2000

              })
            }
          },
          error : (err) => {
            console.log(err)
            this.messageService.add({
              severity : 'error',
              summary: 'Erro',
              detail : 'Falha ao criar ',
              life : 2000

            })
          }
        })
      }
  }



  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}

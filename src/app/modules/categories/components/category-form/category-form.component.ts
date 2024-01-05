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
    this.categoryAction = this.ref.data;

    if(this.categoryAction.event.action === this.editCategoryAction && this.categoryAction.event.categoryName !== null || undefined){
      this.setCategoryName(this.categoryAction.event.categoryName as string)
    }
  }

  setCategoryName(categoryName : string): void {
    if(categoryName){
      this.categoryForm.setValue({
        name: categoryName
      })
    }
  }

  handleSubmitEditCategory(){
    if(this.categoryForm?.value && this.categoryForm.valid && this.categoryAction.event.id){
      const  requestEditCategory: { name : string , category_id : string} = {
        name : this.categoryForm.value.name as string,
        category_id : this.categoryAction.event.id
      }

      this.categoriesService.editCategoryName( requestEditCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next : () => {
          this.categoryForm.reset()

          this.messageService.add({
            severity : 'success',
            summary: 'Sucesso',
            detail : 'Categoria editada com sucesso',
            life : 2000

          })

        }, error : (err) => {
          console.log(err)

          this.messageService.add({
            severity : 'error',
            summary: 'Erro',
            detail : 'Categoria editada com erro',
            life : 2000

          })
        }
      })
    }
  }

  handleSubmitCategoryAction() : void {

    if(this.categoryAction.event.action === this.addCategoryAction){
      this.handleSubmitAddCategory()
    }else if(this.categoryAction.event.action === this.editCategoryAction){
      this.handleSubmitEditCategory()
    }

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

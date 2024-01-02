import { DeleteCategoryAction } from './../../../../models/interfaces/categories/event/DeleteCategoryAction';
import { GetCategoriesResponse } from './../../../../models/interfaces/categories/responses/GetCategoriesResponse';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: []
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ : Subject<void> = new Subject()
  private ref!: DynamicDialogRef

  public categoriesDatas : Array<GetCategoriesResponse> = []

  constructor(
    private categoriesService : CategoriesService,
    private dialogService : DialogService,
    private messageService : MessageService,
    private confirmationService : ConfirmationService,
    private router: Router
  ){}



  ngOnInit(): void {
    this.getAllCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }



  getAllCategories() {

    this.categoriesService.getAllCategories()
    .pipe( takeUntil(this.destroy$))
    .subscribe({
      next : (response)=> {
        if (response.length > 0){
          this.categoriesDatas = response
        }
      }, error: (err) => {
        console.log(err)
        this.messageService.add({
            severity: 'error',
            summary: "Erro",
            detail: 'Erro ao buscar categorias',
            life : 2500
        })
        this.router.navigate(['/dashboard'])
      }
    })

  }

  handleDeleteCategoryAction(event : DeleteCategoryAction) : void {
    if(event){
      this.confirmationService.confirm({
        header : 'Confirmação de exclusão',
        message: `Confirma a exclusão da categoria ${event.categoryName}`,
        icon: 'pi p-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: ()=> this.deleteCategory(event.category_id)
      })
    }
  }

  deleteCategory(category_id: string) {
      if(category_id){
        this.categoriesService.deleteCategorie({category_id})
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next : (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria removida com sucesso',
              life: 3000

            })

            this.getAllCategories()
          },
          error : (err) => {console.log(err)
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Categoria não removida',
              life: 3000

            })

          }
        })
      }
  }

  handleCategoryAction(event : EventAction){
    if(event){
      this.ref = this.dialogService.open(CategoryFormComponent, {
        header: event.action,
        width: '70%',
        contentStyle: { overflow: 'auto'},
        baseZIndex: 1000,
        maximizable: true,
        data : {
          event : event
        }
      });

      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {
        this.getAllCategories()
      })

  }}

}



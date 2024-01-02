import { DeleteCategoryAction } from './../../../../models/interfaces/categories/event/DeleteCategoryAction';
import { GetCategoriesResponse } from './../../../../models/interfaces/categories/responses/GetCategoriesResponse';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { CategoryEvent } from 'src/app/models/enums/categories/CategorieEvent';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: []
})
export class CategoriesTableComponent {

  @Input() public categories : Array<GetCategoriesResponse> = []
  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>()
  @Output() public deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>()
  public categorySelected !: GetCategoriesResponse
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION


  handleDeleteCategoryEvent(category_id : string, categoryName: string):void {

    if(category_id !== '' && categoryName !== ''){
      this.deleteCategoryEvent.emit({category_id, categoryName})
    }

  }

  handleCategoryEvent( action : string, id?: string, categoryName?: string ) : void  {
    if(action  && action !== ''){
      this.categoryEvent.emit({action, id, categoryName})
    }
  }

}

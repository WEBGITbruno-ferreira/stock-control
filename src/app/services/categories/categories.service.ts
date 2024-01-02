import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get("USER_INFO")
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
       Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }


  constructor(
    private http : HttpClient,
    private cookie: CookieService, ) {}


    getAllCategories(): Observable<Array<GetCategoriesResponse>>{

      return this.http.get<Array<GetCategoriesResponse>>(`${this.API_URL}/categories`, this.httpOptions)
    }

    deleteCategorie(requestDatas : {category_id : string}) :  Observable<void>{

      return this.http.delete<void>(`${this.API_URL}/category/delete`, {...this.httpOptions, params : {category_id : requestDatas?.category_id}})
    }

    createNewCategoty(requestDatas : {name : string}) : Observable<Array<GetCategoriesResponse>>{
      return this.http.post<Array<GetCategoriesResponse>>(
        `${this.API_URL}/category`,
        requestDatas,
        this.httpOptions
      )
    }
}

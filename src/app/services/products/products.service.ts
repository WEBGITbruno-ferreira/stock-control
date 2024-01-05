import { SaleProductRequest } from './../../models/interfaces/products/request/SaleProductRequest';
import { CreateProductResponse } from './../../models/interfaces/products/response/CreateProductResponse';
import { CreateProductRequest } from './../../models/interfaces/products/request/CreateProductRequest';
import { DeleteProductResponse } from './../../models/interfaces/products/response/DeleteProductResponse';
import { GetAllProductsResponse } from './../../models/interfaces/products/response/GetAllProductsResponse';
import { map, Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductResponse } from 'src/app/models/interfaces/products/response/SaleProductResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environment.API_URL
  private JWT_TOKEN = this.cookie.get('USER_INFO')


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
       Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }

  constructor(
    private http: HttpClient,
    private cookie: CookieService,

  ) { }

  getAllProducts() : Observable<Array<GetAllProductsResponse>> {

    return this.http.get<Array<GetAllProductsResponse>>(
      `${this.API_URL}/products`, this.httpOptions
    )
    .pipe(
      map((prods) => prods.filter((data)=> data.amount > 0))
    )

  }

  deleteProduct(product_id : string): Observable<DeleteProductResponse> {

    return this.http.delete<DeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions, params : { product_id : product_id

        }
      }
    )
  }

  createProduct(requestData: CreateProductRequest) : Observable<CreateProductResponse> {

  return this.http.post<CreateProductResponse>(`${this.API_URL}/product`, requestData, this.httpOptions)
  }


  editProduct (requestData : EditProductRequest): Observable<void> {

  return this.http.put<void>(`${this.API_URL}/product/edit`, requestData, this.httpOptions)
  }

  saleProduct(requestData : SaleProductRequest): Observable<SaleProductResponse> {

    return this.http.put<SaleProductResponse>(`${this.API_URL}/product/sale`,
    {amount : requestData.amount},
    {...this.httpOptions, params: {product_id : requestData.product_id}})

  }

}

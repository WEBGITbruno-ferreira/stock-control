import { AuthRequest } from './../../models/interfaces/user/auth/AuthRequest';
import { SignupUserRequest } from './../../models/interfaces/user/SignupUserRequest';

import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL

  constructor(private http: HttpClient) { }

  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse>{
    return this.http.post<SignupUserResponse>(`${this.API_URL}/user`, requestDatas)
  }


  authUser(requestDatas: AuthRequest ) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas)
  }
}

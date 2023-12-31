import { Message, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequest } from './../../models/interfaces/user/auth/AuthRequest';
import { SignupUserRequest } from './../../models/interfaces/user/SignupUserRequest';
import { UserService } from './../../services/user/user.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, AfterViewInit{

  @ViewChild('emailInputRef') public emailInputRef !: ElementRef
  @ViewChild('passwordInputRef') public passwordInputRef !: ElementRef
  //para desinscrever do observable
  private  destroy$ = new Subject<void>()
  loginCard = true

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  signUpForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService : MessageService,
    private router : Router
    ) { }
  ngAfterViewInit(): void {
    this.emailInputRef.nativeElement.value = 'teste6@gmail.com'
    this.passwordInputRef.nativeElement.value = 'teste6@gmail.com'
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }



  onSubmitLoginForm(): void {
    //console.log('DADOS DO FORM LOGIN', this.loginForm.value)

    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next : (response) => {
          if(response){
            this.cookieService.set('USER_INFO', response?.token)
            this.loginForm.reset()
            this.router.navigate(['/dashboard'])
            this.messageService.add({
              severity : 'success',
              summary: 'Sucesso',
              detail: `Bem vindo de volta ${response?.name}.`,
              life: 2000
            })
          }
        }, error : (err) => {

          this.messageService.add({
            severity : 'error',
            summary: 'Error',
            detail: `Erro ao autenticar usuário.`,
            life: 2000
          })
        }
      })

    }
  }

  onSubmitSignupForm(): void {
    // console.log('DADOS DO FORM LOGIN', this.signUpForm.value)
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signupUser(this.signUpForm.value as SignupUserRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
        .subscribe({
          next: (response) => {
            if (response) {
              console.log("response", response)
              this.signUpForm.reset()
              this.loginCard = true


              this.messageService.add({
                severity : 'success',
                summary: 'Sucesso',
                detail: `Usuário criado com sucesso ${response?.name}.`,
                life: 2000
              })
            }
          },
          error: (err) => {
            this.messageService.add({
              severity : 'error',
              summary: 'Erro',
              detail: `Erro ao criar usuário.`,
              life: 2000
            })
          }
        })
    }
  }
}

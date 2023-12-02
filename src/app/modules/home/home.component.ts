import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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

     constructor(private formBuilder : FormBuilder) {}

     onSubmitLoginForm() : void {
       console.log('DADOS DO FORM LOGIN', this.loginForm.value)
     }

     onSubmitSignupForm() : void {
      console.log('DADOS DO FORM LOGIN', this.signUpForm.value)
    }
}

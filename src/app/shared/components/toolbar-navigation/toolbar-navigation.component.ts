import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html'

})
export class ToolbarNavigationComponent {
  constructor(
    private cookie : CookieService,
    private router : Router
  ){}

  handleLogout() : void {
    this.cookie.delete('USER_INFO')
    this.router.navigate(['/home'])
  }
}

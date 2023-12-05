import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import {SidebarModule} from "primeng/sidebar"
import {ToolbarModule} from "primeng/toolbar"


@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),

    //primeNG
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule
  ],

  providers: [MessageService, CookieService]
})
export class DashboardModule { }

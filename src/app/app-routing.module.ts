import { AuthGuard } from './guards/auth-guard.service';
import { DashboardHomeComponent } from './modules/dashboard/page/dashboard-home/dashboard-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  {path : '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path : 'home', component: HomeComponent},
  //{path : 'dashboard', component: DashboardHomeComponent},
  {path : 'dashboard',
  loadChildren: ()=> import('./modules/dashboard/dashboard.module')
  .then( (m) => m.DashboardModule),
  canActivate : [AuthGuard] },

  {path : 'products',  loadChildren: ()=> import('./modules/products/products.module')
  .then( (m) => m.ProductsModule),
  canActivate : [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

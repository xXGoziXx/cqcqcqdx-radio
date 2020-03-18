import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { UsedCategoryComponent } from './used-equipment/used-category/used-category.component';
import { ShopByManufacturerComponent } from './shop-by-manufacturer/shop-by-manufacturer.component';
import { NewInComponent } from './new-in/new-in.component';
import { PartExComponent } from './part-ex/part-ex.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { ShopNowComponent } from './shop-now/shop-now.component';
import { EditComponent } from './account/edit/edit.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: 'home',
    redirectTo: '/'
  },
  {
    path: 'product',
    component: ProductComponent,
    data: { breadcrumb: 'All Products' }
  },
  {
    path: 'product/:id',
    component: ProductComponent,
    data: { breadcrumb: 'Product' }
  },
  {
    path: 'shop-now',
    component: ShopNowComponent,
    data: { breadcrumb: 'Shop Now' }
  },
  {
    path: 'used-equipment',
    component: UsedEquipmentComponent,
    data: { breadcrumb: 'Used Equipment' }
  },
  {
    path: 'used-equipment/:category',
    component: UsedCategoryComponent,
    data: { breadcrumb: 'Used Category' }
  },
  {
    path: 'shop-by-manufacturer',
    component: ShopByManufacturerComponent,
    data: { breadcrumb: 'Shop By Manufacturer' }
  },
  {
    path: 'new-in',
    component: NewInComponent,
    data: { breadcrumb: 'New In' }
  },
  {
    path: 'part-ex',
    component: PartExComponent,
    data: { breadcrumb: 'Part Ex' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { breadcrumb: 'Register' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { breadcrumb: 'Login' }
  },
  {
    path: 'account',
    component: AccountComponent,
    data: { breadcrumb: 'Account' },
    canActivate: [AuthGuard]
  },
  {
    path: 'account/edit',
    component: EditComponent,
    data: { breadcrumb: 'Edit' },
    canActivate: [AuthGuard]
  },
  {
    path: 'contact-us',
    component: ContactComponent,
    data: { breadcrumb: 'Contact Us' }
  },
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Home' }
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { UsedCategoryComponent } from './used-equipment/used-category/used-category.component';
import { ShopByManufacturerComponent } from './shop-by-manufacturer/shop-by-manufacturer.component';
import { NewInComponent } from './new-in/new-in.component';
// import { PartExComponent } from './part-ex/part-ex.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { ShopNowComponent } from './shop-now/shop-now.component';
import { EditComponent } from './account/edit/edit.component';
import { ProductComponent } from './product/product.component';
import { ManufacturerProductsComponent } from './shop-by-manufacturer/manufacturer-products/manufacturer-products.component';

const routes: Routes = [
  {
    path: 'home',
    redirectTo: '/'
  },
  {
    path: 'product',
    pathMatch: 'full',
    component: ProductComponent,
    data: { breadcrumb: 'All Products' },
    canActivate: [AuthGuard]
  },
  {
    path: 'product/:id',
    pathMatch: 'full',
    component: ProductComponent,
    data: { breadcrumb: 'Product' },
    canActivate: [AuthGuard]
  },
  {
    path: 'shop-now',
    pathMatch: 'full',
    component: ShopNowComponent,
    data: { breadcrumb: 'Shop Now' },
    canActivate: [AuthGuard]
  },
  {
    path: 'used-equipment',
    pathMatch: 'full',
    component: UsedEquipmentComponent,
    data: { breadcrumb: 'Used Equipment' },
    canActivate: [AuthGuard]
  },
  {
    path: 'used-equipment/:category',
    pathMatch: 'full',
    component: UsedCategoryComponent,
    data: { breadcrumb: 'Used Category' },
    canActivate: [AuthGuard]
  },
  {
    path: 'shop-by-manufacturer',
    pathMatch: 'full',
    component: ShopByManufacturerComponent,
    data: { breadcrumb: 'Shop By Manufacturer' },
    canActivate: [AuthGuard]
  },
  {
    path: 'shop-by-manufacturer/:manufacturer',
    pathMatch: 'full',
    component: ManufacturerProductsComponent,
    data: { breadcrumb: 'Manufacturer Products' },
    canActivate: [AuthGuard]
  },
  {
    path: 'new-in',
    pathMatch: 'full',
    component: NewInComponent,
    data: { breadcrumb: 'New In' },
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'part-ex',
  //   pathMatch: 'full',
  //   component: PartExComponent,
  //   data: { breadcrumb: 'Part Ex' }
  // },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent,
    data: { breadcrumb: 'Register' }
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    data: { breadcrumb: 'Login' }
  },
  {
    path: 'account',
    pathMatch: 'full',
    component: AccountComponent,
    data: { breadcrumb: 'Account' },
    canActivate: [AuthGuard]
  },
  {
    path: 'account/edit',
    pathMatch: 'full',
    component: EditComponent,
    data: { breadcrumb: 'Edit' },
    canActivate: [AuthGuard]
  },
  {
    path: 'contact-us',
    pathMatch: 'full',
    component: ContactComponent,
    data: { breadcrumb: 'Contact Us' }
  },
  {
    path: '',
    pathMatch: 'full',
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { UsedCategoryComponent } from './used-equipment/used-category/used-category.component';
import { ShopByManufacturerComponent } from './shop-by-manufacturer/shop-by-manufacturer.component';
import { NewInComponent } from './new-in/new-in.component';
import { PartExComponent } from './part-ex/part-ex.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { ShopNowComponent } from './shop-now/shop-now.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'shop-now',
    component: ShopNowComponent,
    data: { title: 'shop-now' }
  },
  {
    path: 'used-equipment',
    component: UsedEquipmentComponent,
    data: { title: 'Used Equipment' }
  },
  {
    path: 'used-equipment/:category',
    component: UsedCategoryComponent,
    data: { title: 'Used Category' }
  },
  {
    path: 'shop-by-manufacturer',
    component: ShopByManufacturerComponent,
    data: { title: 'Shop By Manufacturer' }
  },
  {
    path: 'new-in',
    component: NewInComponent,
    data: { title: 'New In' }
  },
  {
    path: 'part-ex',
    component: PartExComponent,
    data: { title: 'Part Ex' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { title: 'Contact' }
  },
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Homepage' }
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
    data: { title: 'Homepage' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

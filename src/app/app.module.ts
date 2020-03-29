import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { ShopByManufacturerComponent } from './shop-by-manufacturer/shop-by-manufacturer.component';
import { NewInComponent } from './new-in/new-in.component';
// import { PartExComponent } from './part-ex/part-ex.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { ShopNowComponent } from './shop-now/shop-now.component';
import { UsedCategoryComponent } from './used-equipment/used-category/used-category.component';
import { AccountComponent } from './account/account.component';
import { EditComponent } from './account/edit/edit.component';
import { ProductComponent } from './product/product.component';
import { ManufacturerProductsComponent } from './shop-by-manufacturer/manufacturer-products/manufacturer-products.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    UsedEquipmentComponent,
    ShopByManufacturerComponent,
    NewInComponent,
    // PartExComponent,
    RegisterComponent,
    LoginComponent,
    ContactComponent,
    ShopNowComponent,
    UsedCategoryComponent,
    AccountComponent,
    EditComponent,
    ProductComponent,
    ManufacturerProductsComponent
  ],
  imports: [
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence({
      synchronizeTabs: true
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule {}

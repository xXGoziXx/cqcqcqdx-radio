// import { PartExComponent } from './part-ex/part-ex.component';
import { AccountComponent } from './account/account.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { ContactComponent } from './contact/contact.component';
import { EditComponent } from './account/edit/edit.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LoginComponent } from './login/login.component';
import { ManufacturerProductsComponent } from './shop-by-manufacturer/manufacturer-products/manufacturer-products.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NewInComponent } from './new-in/new-in.component';
import { NgModule } from '@angular/core';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { ShopByManufacturerComponent } from './shop-by-manufacturer/shop-by-manufacturer.component';
import { ShopNowComponent } from './shop-now/shop-now.component';
import { UsedCategoryComponent } from './used-equipment/used-category/used-category.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { environment } from '../environments/environment';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

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
    ManufacturerProductsComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    LazyLoadImageModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule {}

// import { PartExComponent } from './part-ex/part-ex.component';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { EditComponent } from './account/edit/edit.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManufacturerProductsComponent } from './shop-by-manufacturer/manufacturer-products/manufacturer-products.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NewInComponent } from './new-in/new-in.component';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { ShopByManufacturerComponent } from './shop-by-manufacturer/shop-by-manufacturer.component';
import { ShopNowComponent } from './shop-now/shop-now.component';
import { UsedCategoryComponent } from './used-equipment/used-category/used-category.component';
import { UsedEquipmentComponent } from './used-equipment/used-equipment.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ViewAllOrdersComponent } from './account/view-all-orders/view-all-orders.component';
import { AddProductComponent } from './account/add-product/add-product.component';
import { AddManufacturerComponent } from './account/add-manufacturer/add-manufacturer.component';
import { AddOrderComponent } from './account/add-order/add-order.component';
import { UpdateNewsComponent } from './account/update-news/update-news.component';
import { MyOrdersComponent } from './account/my-orders/my-orders.component';
import { ViewAllMembersComponent } from './account/view-all-members/view-all-members.component';

import { AuthService } from './services/auth.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { SortByPipe } from './pipes/sort-by.pipe';
import { CustomCommandsComponent } from './account/custom-commands/custom-commands.component';
import { AddLinksComponent } from './account/add-links/add-links.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

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
    PrivacyPolicyComponent,
    ViewAllOrdersComponent,
    MyOrdersComponent,
    AddProductComponent,
    AddManufacturerComponent,
    ViewAllMembersComponent,
    AddOrderComponent,
    SortByPipe,
    UpdateNewsComponent,
    CustomCommandsComponent,
    AddLinksComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AppRoutingModule,
    BrowserModule,
    CKEditorModule,
    FormsModule,
    LazyLoadImageModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, GoogleAnalyticsService, AngularFirestore, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { config } from './config';

/* Components */
import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { GoodsComponent } from './goods/goods.component';
import { OrderComponent } from './order/order.component';
import { OrderEditComponent } from './order-edit/order-edit.component';

/* Add Bootstrap */
import { ModalModule } from 'ngx-bootstrap/modal';
import {AlertConfig, AlertModule} from 'ngx-bootstrap/alert';

/* PrimeNG */
import { ButtonModule } from 'primeng/button';
import { CalendarModule, KeyFilterModule, PickListModule, TabMenuModule, ToolbarModule } from 'primeng/primeng';
import { EditableRow, TableModule } from 'primeng/table';
import { EditorModule } from 'primeng/editor';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, DialogService, MessageService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    GoodsComponent,
    OrderComponent,
    OrderEditComponent
  ],
  imports: [
    CoreModule.forRoot(config),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    // PrimeNG
    ButtonModule,
    TabMenuModule,
    TableModule,
    ToolbarModule,
    EditorModule,
    PanelModule,
    AlertModule,
    ModalModule.forRoot(),
    CardModule,
    InputTextModule,
    InputMaskModule,
    InputSwitchModule,
    ToastModule,
    KeyFilterModule,
    RadioButtonModule,
    ConfirmDialogModule,
    PickListModule,
    CalendarModule,
    DynamicDialogModule
  ],
  entryComponents: [
    OrderEditComponent
  ],
  providers: [
    MessageService,
    AlertConfig,
    EditableRow,
    ConfirmationService,
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

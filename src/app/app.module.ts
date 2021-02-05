import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Add Bootstrap */
// import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { APP_PROVIDERS } from './app.providers';
import { APP_IMPORTS } from './app.imports';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    APP_IMPORTS,

    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    // TooltipModule.forRoot()
  ],
  providers: [APP_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }

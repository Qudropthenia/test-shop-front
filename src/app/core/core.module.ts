import {
    NgModule,
    ModuleWithProviders,
    Optional,
    SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { AppConfig } from './app.config';

@NgModule({
    imports: [ CommonModule ],
    providers: [ ApiService ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: AppConfig): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                { provide: AppConfig, useValue: config }
            ]
        };
    }
}

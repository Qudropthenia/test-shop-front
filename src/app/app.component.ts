import { Component } from '@angular/core';
import { ApiService } from './core/api.service';
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-shop-front';

  constructor(private api: ApiService) {
  }

  testMethod() {
    // const path = 'test/repiter';
    const path = 'test/post';
    const params = {
      data1: 'xyz',
      data2: 'pqr'
    };

    // this.api.get(path, null).subscribe({
    //   next: (data: any) => console.log(),
    //   error: err => console.log('err'),
    //   complete: () => console.log('Compilation')
    //   });
    let p: HttpParams = new HttpParams({ fromString: 'param=param' });
    this.api.post(path, params, p).subscribe({
      next: (data: any) => console.log(data),
      error: err => console.log('err'),
      complete: () => console.log('Compilation')
      });
  }
}

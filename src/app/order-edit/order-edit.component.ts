import { Component, OnInit } from '@angular/core';
import { Goods } from '../domain/goods';
import { Order } from '../domain/order';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {
  private SERVICE_PATH = 'spring-data';

  // Goods
  allGoods: Goods[];
  sourceGoods: Goods[] = [];
  targetGoods: Goods[] = [];

  // Order
  newOrder: Order;

  constructor(private httpApi: ApiService) { }

  ngOnInit() {
    this.newOrder = {
      id: 0,
      client: '',
      address: '',
      goods: []
    } as Order;
    this.initGoods();
  }

  private initGoods() {
    this.allGoods = [];
    this.loadGoods()
        .then((goods: Goods[]) => {
          this.allGoods = goods;
          this.resetPickListData();
        })
        .catch(reason => this.allGoods = reason);
  }

  private loadGoods(): Promise<Goods[]> {
    return new Promise((resolve, reject) => {
      const url = `${this.SERVICE_PATH}/listGoodsAll`;

      this.httpApi.get(url).subscribe({
        next: (g: Goods[]) => {
          resolve(g);
          return;
        },
        error: err => reject([])
      });
    });
  }

  private resetPickListData() {
    this.sourceGoods = Object.assign([], this.allGoods);
    this.targetGoods = [];
  }

  addOrder() {
    // let a = [{id: 4, name: '4', price: 4}, {id: 2, name: 'asd', price: 12}];
    // this.sourceGoods = Object.assign([], a);
    // console.log('this.allGoods');
    // console.log(this.allGoods);
    // console.log('this.sourceGoods');
    // console.log(this.sourceGoods);
    // console.log('this.targetGoods');
    // console.log(this.targetGoods);
  }
}

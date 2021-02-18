import { Component, OnInit } from '@angular/core';
import { Order } from '../domain/order';
import { Goods } from '../domain/goods';
import { ApiService } from '../core/api.service';
import {isNull, isNullOrUndefined} from 'util';
import { HttpParams } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  private SERVICE_PATH = 'spring-data';
  searchId: number;

  // Goods
  private allGoods: Goods[];
  sourceGoods: Goods[] = [];
  targetGoods: Goods[] = [];

  // Order
  orders: Order[] = [];
  newOrder: Order;

  constructor(private httpApi: ApiService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.clearAddForm();
    this.loadOrders();
  }

  // Очистка формы добавления/редактирования
  clearAddForm() {
    this.newOrder = {
      id: 0,
      client: '',
      address: '',
      goods: []
    } as Order;
    this.initGoods();
  }

  // Обновление сведений о товаре для pickList
  private initGoods() {
    this.allGoods = [];
    this.loadGoods()
        .then((goods: Goods[]) => {
          this.allGoods = goods;
          this.resetPickListData();
        })
        .catch(reason => this.allGoods = reason);
  }

  // Подгрузка списка товаров
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

  // Исходные данные для pickList
  private resetPickListData() {
    this.sourceGoods = Object.assign([], this.allGoods);
    this.targetGoods = [];
  }

  loadOrders() {
    this.orders = [];
    this.httpApi.get(`${this.SERVICE_PATH}/listOrdersAll`).subscribe({
      next: (resp: Order[]) => {
        resp.forEach((r: Order) => r.date = new Date(r.date));
        this.orders = resp;
      }
    });
  }

  selectToEdit(order: Order) {
    this.newOrder = Object.assign({}, order, {goods: Object.assign([], order.goods)});
    this.targetGoods = this.newOrder.goods;
    this.sourceGoods = this.allGoods.filter((filterGoods) =>
        !this.targetGoods.some((someGoods) => filterGoods.id === someGoods.id)
    );
  }

  addOrder() {
    try {
      this.checkSavedData();
      this.newOrder.goods = Object.assign([], this.targetGoods);
    } catch (e) {
      console.log(e);
      return;
    }

    const body = {
      id: this.newOrder.id,
      client: this.newOrder.client.trim(),
      address: this.newOrder.address.trim(),
      date: this.dateToStr(this.newOrder.date as Date),
      goods: this.newOrder.goods
    };
    const url = `${this.SERVICE_PATH}/saveOrder`;
    this.httpApi.post(url, body).subscribe((order: Order) => {
      if (body.id > 0) {
        const index = this.orders.findIndex((value) => value.id === body.id);
        this.orders[index] = order;
      } else {
        this.orders.push(order);
      }
    });
  }

  onRowDeleteInit(index: number) {
    this.confirmationService.confirm({
      message: 'Подтвердите удаление',
      accept: () => this.deleteOrder(index)
    });
  }

  private deleteOrder(id: number) {
    const url = `${this.SERVICE_PATH}/delOrder`;
    this.httpApi.get(url, new HttpParams({ fromString: `id:${id}` }))
        .subscribe({
          next: value => {
            this.orders = this.orders.filter((order) => order.id !== id);
            if (this.newOrder.id === id) {
              this.clearAddForm();
            }
            if (this.newOrder.id === id) {
              this.clearAddForm();
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Удаление информации о заказе',
              detail: 'Успешно'
            });
          },
          error: e => {
            this.messageService.add({
              severity: 'error',
              summary: 'Удаление информации о заказе',
              detail: 'Ошибка'
            });
          }
        });
  }

  onSearchOrder(id: number) {
    if (isNullOrUndefined(id) || id < 1) {
      return;
    }

    const url = `${this.SERVICE_PATH}/findOrderById`;
    this.httpApi.get(url, new HttpParams({ fromString: `id=${id}` }))
        .subscribe({
          next: (resp: any) => {
            this.orders = [];
            if (isNull(resp)) { return; }

            resp.date = new Date(resp.date);
            this.orders = [resp];
          },
          error: err => this.messageService.add({
            severity: 'error',
            summary: 'Поиск заказа',
            detail: 'Ошибка'
          })
        });
  }

  private dateToStr(date: Date): string | Error {
    if (isNullOrUndefined(date)) {
      throw new Error('Укажите дату');
    }

    const day: string = ('0' + date.getDate()).slice(-2);
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2);

    return `${day}.${month}.${date.getFullYear()}`;
  }

  private checkSavedData(): Error | void {
    if (!this.checkTextFields(this.newOrder.client)) {
      throw new Error('Укажите клиента');
    }
    this.dateToStr(this.newOrder.date as Date);
    if (!this.checkTextFields(this.newOrder.address)) {
      throw new Error('Укажите адрес');
    }
    if (this.targetGoods.length < 1) {
      throw new Error('Укажите товар');
    }
  }

  private checkTextFields(str: string): boolean {
    if (isNullOrUndefined(str) || str.length < 1) { return false; }
    str = str.trim();

    return str.length >= 1;
  }
}

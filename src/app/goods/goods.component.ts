import { Component, OnInit } from '@angular/core';
import { Goods } from '../domain/goods';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../core/api.service';
import { isNullOrUndefined } from 'util';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class GoodsComponent implements OnInit {
  private SERVICE_PATH = 'spring-data';
  private regexPrice: RegExp = /^\d+(?:[.,]\d{1,2})?$/;
  tableCols: any[];

  goods: Goods[];
  newGoods: Goods;
  editableGoods: Goods;
  saveBtnDisable: boolean;
  editBtnDisable: boolean;
  searchData: string;
  radioSelect: string;

  constructor(private httpApi: ApiService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.saveBtnDisable = false;
    this.editBtnDisable = false;
    this.newGoods = this.initGoods();
    this.goods = this.loadGoods();
    this.searchData = '';
    this.tableCols = [
      { field: 'id',    header: 'Id' },
      { field: 'name',  header: 'Наименование' },
      { field: 'price', header: 'Цена, ₽' }
    ];
    this.radioSelect = 'Id';
  }

  private loadGoods(): Goods[] {
    const url = `${this.SERVICE_PATH}/listGoodsAll`;
    const goods: Goods[] = [];

    this.httpApi.get(url).subscribe((row: any) =>
        row.forEach((g: Goods) => goods.push(g))
    );

    return goods;
  }

  private initGoods(): Goods {
    return { id: 0, name: '' };
  }

  private checkGoods(g: Goods): boolean | Error {
    g.name = g.name.trim();
    if (g.name.length < 1 || g.name.length > 100) {
      // throw new Error('Укажина наименование товара');
      throw new Error('Укажина наименование товара');
    }
    if (isNullOrUndefined(g.price)) {
      throw new Error('Некоректно указана цена');
    }
    const price: string = (g.price + '').trim().replace(',', '.');
    if (!this.regexPrice.test(price)) {
      throw new Error('Некоректно указана цена');
    }
    g.price = Number(price);
    return true;
  }

  /**
   * Добавление/обновление сведений о товаре
   * @param g - сведения о добавляемом объекте
   * @returns {Promise<T>} - сохранённый объект
   */
  private saveGoods(g: Goods): Promise<Goods | any> {
    return new Promise((resolve, reject) => {
      const url = `${this.SERVICE_PATH}/saveGoods`;

      this.httpApi.post(url, g).subscribe({
        next: (savedGoods: Goods) => {
          resolve(savedGoods);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  addGoods() {
    const msgTitle = 'Добавление сведений о продукте';
    try {
      this.checkGoods(this.newGoods);
    } catch (e) {
      this.toastMSG('error', 'Ошибка валидации формы', e.message);
      return;
    }

    this.saveBtnDisable = true;
    this.saveGoods(this.newGoods)
        .then((goods: Goods) => {
          this.toastMSG('success', msgTitle, 'Успешно');
          this.goods.push(goods);
          this.newGoods = this.initGoods();
        })
        .catch(reason => this.toastMSG('error', msgTitle, reason));
    this.saveBtnDisable = false;
  }

  onRowDeleteInit(index: number) {
    this.confirmationService.confirm({
      message: 'Подтвердите удаление',
      accept: () => this.deleteGoods(index)
    });
  }

  private deleteGoods(index: number) {
    if (isNullOrUndefined(index) || isNaN(index) || index < 1) {
      this.toastMSG('error', 'Удаление данных', 'Некорректное значение');
      return;
    }

    const url = `${this.SERVICE_PATH}/gelGoods`;
    const delId = this.goods[index].id;
    this.httpApi.get(url, new HttpParams({ fromString: `id=${delId}` }))
        .subscribe((isDeleted: boolean) => {
          if (isDeleted) {
            this.toastMSG('success', '', 'Сведения удалены');
            this.goods.splice(index, 1);
          } else {
            this.toastMSG('error', '', 'Ошибка при удалении');
          }
        });
  }

  onRowEditInit(goods: Goods) {
    this.editBtnDisable = true;
    this.editableGoods = {...goods};
  }

  onRowEditSave(goods: Goods) {
    try {
      this.checkGoods(goods);
    } catch (e) {
      this.toastMSG('error', 'Ошибка валидации формы', e.message);
      return;
    }

    this.saveGoods(goods)
      .then((g: Goods) => {
        const index = this.goods.findIndex((value) => value === goods);
        this.goods[index] = g;
        this.toastMSG('success', 'Обновление сведений о товаре', 'Сохранено');
    });
    this.editBtnDisable = false;
  }

  onRowEditCancel(index: number) {
    this.goods[index] = this.editableGoods;
    delete this.editableGoods;
    this.editBtnDisable = false;
  }

  findGoodsByIdName() {
    if (isNullOrUndefined(this.searchData)) {
      this.toastMSG('error', 'Ошибка поиска', 'Некорректное значение');
      return;
    }
    let params: HttpParams = new HttpParams();

    switch (this.radioSelect) {
      case 'Id': {
        const idTemp = Number(this.searchData.trim());
        if (isNaN(idTemp) || idTemp < 1) {
          this.toastMSG('error', 'Ошибка поиска', 'Некорректное значение');
          return;
        }
        params = params.set('id', idTemp + '');
        break;
      }
      case 'Наименование': {
        params = params.set('name', this.searchData.trim());
        break;
      }
    }
    const url = `${this.SERVICE_PATH}/findGoodsByIdName`;
    this.httpApi.get(url, params).subscribe((row: any[]) => {
      const tempGoods: Goods[] = [];
      row.forEach((goods: Goods) => tempGoods.push(goods));
      this.goods = tempGoods;
    });
  }

  uploadGoods() {
    this.goods = [];
    this.goods = this.loadGoods();
  }

  private toastMSG(type: 'success' | 'error', title: string, msg: string) {
    this.messageService.add({severity: type, summary: title,  detail: msg});
  }
}

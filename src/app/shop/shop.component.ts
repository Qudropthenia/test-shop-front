import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  items: MenuItem[];
  activeItem: MenuItem;
  selectedItemMenu: string;

  constructor() { }

  ngOnInit() {
    this.initTabMenu();
  }

  // Заполняем мею
  private initTabMenu(): void {
    this.items = [
      { id: 'orders', label: 'Журнал заказов', icon: 'pi pi-fw pi-shopping-cart',
        command: event => this.getActiveItemId(event) },
      { id: 'goods', label: 'Справочник товара', icon: 'pi pi-fw pi-list',
        command: event => this.getActiveItemId(event) }
    ];
    this.activeItem = this.items[0];
    this.selectedItemMenu = this.activeItem.id;
  }

  // Получаемый выбранный пункт меню
  getActiveItemId(activeItem: any): void {
    if (isNullOrUndefined(activeItem)) { return; }

    this.selectedItemMenu = (activeItem.item as MenuItem).id;
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.css']
})
export class DualListboxComponent<T> implements OnInit {

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faAngleDoubleRight = faAngleDoubleRight;
  
  @Input() available: T[] = [];
  @Input() selected: T[] = [];

  availableItems: ItemWrapper<T>[] = [];
  selectedItems: ItemWrapper<T>[] = [];
  
  /**
   * Callable which converts given object to string representation displayed in listbox.
   * 
   * @param item 
   */
  @Input() presenter: (item: T) => string = (item: T) => item.toString();
  
  @Output() itemSelected = new EventEmitter<T>();

  constructor() {
  }

  ngOnInit(): void {
    this.available.forEach((i: T) => this.availableItems.push(new ItemWrapper(i, false)));
    this.selected.forEach((i: T) => this.selectedItems.push(new ItemWrapper(i, false)));
  }

  selectClicked(): void {
    this.availableItems.filter(i => i.selected).map(i => {
      this.availableItems.splice(this.availableItems.indexOf(i), 1);
      i.selected = false;
      this.selectedItems.push(i);
    });
  }

  unselectClicked(): void {
    this.selectedItems.filter(i => i.selected).map(i => {
      this.selectedItems.splice(this.selectedItems.indexOf(i), 1);
      i.selected = false;
      this.availableItems.push(i);
    });
  }

  selectAllClicked(): void {
    this.availableItems.forEach(i => {
      i.selected = false;
      this.selectedItems.push(i);
    });
    this.availableItems.splice(0);
  }

  unselectAllClicked(): void {
    this.selectedItems.forEach(i => {
      i.selected = false;
      this.availableItems.push(i);
    });
    this.selectedItems.splice(0);
  }
}

class ItemWrapper<T> {

  constructor(
      public item: T,
      public selected: boolean) {
  }

  toggle(): void {
    this.selected = !this.selected;
  }
}

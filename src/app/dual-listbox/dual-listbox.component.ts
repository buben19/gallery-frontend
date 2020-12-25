import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';

/**
 * 
 * @template T Item model type.
 * @template S Item field type which can be compared to item model.
 */
@Component({
  selector: 'app-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.css']
})
export class DualListboxComponent<T, S> implements OnInit, OnDestroy, CollectionViewer {

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faAngleDoubleRight = faAngleDoubleRight;
  
  @Input() itemDataSource: DataSource<T>;
  @Input() selected: S[] | null;

  availableItems: ItemWrapper<T>[] = [];
  selectedItems: ItemWrapper<T>[] = [];

  viewChange: BehaviorSubject<{start: number, end: number}> = 
    new BehaviorSubject<{start: number, end: number}>({start: 0, end: Number.MAX_VALUE});
  
  /**
   * Callable which converts given object to string representation displayed in listbox.
   * 
   * @param item Item which will be rendered.
   */
  @Input() presenter: ListboxPresenter<T> = (item: T): string => item.toString();

  @Input() comparator: ListboxItemComparator<T, S> = (item: T, selected: S): boolean => false;
  
  @Output() selectionChanged: EventEmitter<T[]> = new EventEmitter<T[]>();

  constructor() {
  }

  ngOnInit(): void {
    this.itemDataSource.connect(this)
      .subscribe(data => data.forEach(i => {
        let wrapper = new ItemWrapper(i, false);
        let selected = false;
        if (this.selected) {
          this.selected.forEach(s => {
            if (this.comparator(i, s)) {
              this.selectedItems.push(wrapper);
              selected = true;
              this.selectionChanged.emit(this.selectedItems.map(selected => selected.item));
            }
          });
        }
        if (!selected) {
          this.availableItems.push(wrapper);
        }
      }));
  }

  ngOnDestroy(): void {
    this.itemDataSource.disconnect(this);
  }

  selectClicked(): void {
    this.availableItems.filter(i => i.selected).map(i => {
      this.availableItems.splice(this.availableItems.indexOf(i), 1);
      i.selected = false;
      this.selectedItems.push(i);
    });
    this.selectionChanged.emit(this.selectedItems.map(selected => selected.item));
  }

  unselectClicked(): void {
    this.selectedItems.filter(i => i.selected).map(i => {
      this.selectedItems.splice(this.selectedItems.indexOf(i), 1);
      i.selected = false;
      this.availableItems.push(i);
    });
    this.selectionChanged.emit(this.selectedItems.map(selected => selected.item));
  }

  selectAllClicked(): void {
    this.availableItems.forEach(i => {
      i.selected = false;
      this.selectedItems.push(i);
    });
    this.availableItems.splice(0);
    this.selectionChanged.emit(this.selectedItems.map(selected => selected.item));
  }

  unselectAllClicked(): void {
    this.selectedItems.forEach(i => {
      i.selected = false;
      this.availableItems.push(i);
    });
    this.selectedItems.splice(0);
    this.selectionChanged.emit(this.selectedItems.map(selected => selected.item));
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

export interface ListboxPresenter<T> {

  (item: T): string;
}

export interface ListboxItemComparator<T, S> {

  (item: T, selected: S): boolean;
}

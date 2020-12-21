import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  items = [
    {id: 1, name: "item1", description: "My item 1"},
    {id: 2, name: "item2", description: "My item 2"},
    {id: 3, name: "item3", description: "My item 3"},
    {id: 4, name: "item4", description: "My item 4"},
    {id: 5, name: "item5", description: "My item 5"},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  presenter(item: any): string {
    return item.name;
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-developer-home',
  templateUrl: './developer-home.component.html',
  styleUrls: ['./developer-home.component.css'],
})
export class DeveloperHomeComponent implements OnInit {
  constructor() {}

  createproject = '';
  ngOnInit(): void {}

  create() {
    this.createproject = 'cs546';
  }
  // ngmodal, ngif, ngfor
}

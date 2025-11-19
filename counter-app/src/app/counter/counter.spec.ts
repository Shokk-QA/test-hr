import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Простой счетчик на Angular</h1>
    <button (click)="decrement()">-</button>
    <span>{{ counter }}</span>
    <button (click)="increment()">+</button>
  `,
  styles: [
    `
      button {
        font-size: 2em;
        width: 50px;
        height: 50px;
      }
      span {
        font-size: 2em;
        margin: 0 20px;
      }
    `,
  ],
})
export class AppComponent {
  counter = 0;

  increment() {
    this.counter++;
  }

  decrement() {
    this.counter--;
  }
}

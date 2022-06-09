import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-t-button',
  templateUrl: './t-button.component.html',
  styleUrls: ['./t-button.component.scss']
})
export class TButtonComponent implements OnInit {

  @Input() color!: string;

  constructor() { }

  ngOnInit(): void {
  }

}

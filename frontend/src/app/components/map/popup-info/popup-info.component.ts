import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-info',
  templateUrl: './popup-info.component.html',
  styleUrls: ['./popup-info.component.scss'],
})
export class PopupInfoComponent implements OnInit {
  @Input() eqId: number;

  ngOnInit() {}
}

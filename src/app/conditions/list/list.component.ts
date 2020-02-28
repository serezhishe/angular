import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Limitation } from '../num-input/group.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Output() Ineq: EventEmitter<Limitation> = new EventEmitter();
  @Input() public Inequal: any;
  @Input() public label: string[];
  @Input() public formsCount: number[];
  constructor() { }

  ngOnInit(): void {
  }

  OnIneq(event: Limitation) {
    this.Ineq.emit(event);
  }

}

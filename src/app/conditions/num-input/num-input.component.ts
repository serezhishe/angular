import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Limitation } from './group.model';

@Component({
  selector: 'app-num-input',
  templateUrl: './num-input.component.html',
  styleUrls: ['./num-input.component.css']
})
export class NumInputComponent implements OnInit {
  public labels = ['X1', 'X2'];
  public checkoutForm;
  @Input() public counter: number;
  public signs: string[];
  public selected: string;
  public signControl = 'sign';
  private group: Limitation = {
    X1: undefined,
    X2: undefined,
    sign: '',
    limit: undefined,
    lineNumber: undefined,
  };
  @Output() Inequal: EventEmitter<Limitation> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.signs = ['<=', '=', '>='];
    this.checkoutForm = this.formBuilder.group(this.group);
  }

  onSubmit(data: Limitation) {
    data.lineNumber = this.counter;
    this.Inequal.emit(data);
  }
}

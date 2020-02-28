import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {
  public initForm: FormGroup;
  public functionForm: FormGroup;
  @Output() Initial: EventEmitter<any> = new EventEmitter();
  @Output() FunctionParams: EventEmitter<any> = new EventEmitter();
  private initGroup: { inequalities: number };
  private functionGroup: { X1: number, X2: number};
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initGroup = {
      inequalities: undefined,
    };
    this.functionGroup = {
      X1: undefined,
      X2: undefined,
    };
    this.initForm = this.formBuilder.group(this.initGroup);
    this.functionForm = this.formBuilder.group(this.functionGroup);
  }

  onSubmit(data: {inequalities: number}) {
    this.Initial.emit(data);
  }
  onFunctionParams(something: { X1: number, X2: number}) {
    this.FunctionParams.emit(something);
  }
}

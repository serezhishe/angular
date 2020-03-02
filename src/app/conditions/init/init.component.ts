import { ITargetFunction } from './../../shared/models/target-function.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTransferService } from 'src/app/shared/services/data-transfer.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css'],
})
export class InitComponent implements OnInit {
  @Output()
  initial: EventEmitter<any> = new EventEmitter();

  public initForm: FormGroup;
  public functionForm: FormGroup;
  private initGroup: { inequalities: number };
  private functionGroup: ITargetFunction;
  constructor(private formBuilder: FormBuilder, private dataTransfer: DataTransferService) {}

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

  onSubmit(data: {inequalities: number}): void {
    this.initial.emit(data);
  }
  onFunctionParams(params: ITargetFunction): void {
    this.dataTransfer.updateTargetFunction(params);
  }
}

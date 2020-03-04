import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTransferService } from 'src/app/shared/services/data-transfer.service';

import { ITargetFunction } from './../../shared/models/target-function.model';

@Component({
  selector: 'app-init',
  styleUrls: ['./init.component.css'],
  templateUrl: './init.component.html',
})
export class InitComponent implements OnInit {
  public functionForm: FormGroup;

  public initForm: FormGroup;
  @Output()
  public initial: EventEmitter<{inequalities: number}> = new EventEmitter();
  private functionGroup: ITargetFunction;
  private initGroup: { inequalities: number };
  public constructor(private readonly formBuilder: FormBuilder, private readonly dataTransfer: DataTransferService) {}

  public ngOnInit(): void {
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
  public onFunctionParams(params: ITargetFunction): void {
    this.dataTransfer.updateTargetFunction(params);
  }

  public onSubmit(data: {inequalities: number}): void {
    this.initial.emit(data);
  }
}

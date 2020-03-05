import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ITargetFunction } from '../../models/target-function.model';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-initial-form',
  styleUrls: ['./initial-form.component.css'],
  templateUrl: './initial-form.component.html',
})
export class InitialFormComponent implements OnInit {
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

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ILimitation } from '../../models/group.model';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-inequality-form',
  styleUrls: ['./inequality-form.component.css'],
  templateUrl: './inequality-form.component.html',
})
export class InequalityFormComponent implements OnInit {
  public checkoutForm: FormGroup;
  @Input()
  public counter: number;
  public labels: string[];
  public selected: string;
  public signControl: string;
  public signs: string[];
  private group: ILimitation;

  public constructor(private readonly formBuilder: FormBuilder, private readonly dataTransferService: DataTransferService) {
    this.signControl = 'sign';
    this.labels = ['X1', 'X2'];
  }

  public ngOnInit(): void {
    this.group = {
      X1: undefined,
      X2: undefined,
      limit: undefined,
      lineNumber: this.counter,
      sign: '<=',
    };
    this.signs = ['<=', '=', '>='];
    this.checkoutForm = this.formBuilder.group(this.group);
  }

  public onSubmit(inequality: ILimitation): void {
    this.dataTransferService.updateInequalities(inequality);
  }
}

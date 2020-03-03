import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ILimitation } from '../../shared/models/group.model';
import { DataTransferService } from 'src/app/shared/services/data-transfer.service';

@Component({
  selector: 'app-inequality-form',
  templateUrl: './inequality-form.component.html',
  styleUrls: ['./inequality-form.component.css'],
})
export class InequalityFormComponent implements OnInit {
  @Input()
  public counter: number;

  public labels = ['X1', 'X2'];
  public checkoutForm: FormGroup;
  public signs: string[];
  public selected: string;
  public signControl = 'sign';
  private group: ILimitation;

  constructor(private formBuilder: FormBuilder, private dataTransferService: DataTransferService) {}

  ngOnInit(): void {
    this.group = {
      X1: undefined,
      X2: undefined,
      sign: '',
      limit: undefined,
      lineNumber: this.counter,
    };
    this.signs = ['<=', '=', '>='];
    this.checkoutForm = this.formBuilder.group(this.group);
  }

  onSubmit(inequality: ILimitation): void {
    this.dataTransferService.updateInequalities(inequality);
  }
}

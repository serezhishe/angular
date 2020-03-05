import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { combineLatest, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { ILine } from '../../models/line.model';
import { DataTransferService } from '../../services/data-transfer.service';
import { GraphService } from '../../services/graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  public chart: Chart;
  private chartSubscription: Subscription;

  public constructor(public graphService: GraphService, private readonly dataTransferService: DataTransferService) {}

  public ngOnDestroy(): void {
    this.chartSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.chart = new Chart({
      chart: {
        animation: {
            duration: 2000,
        },
        type: 'area',
      },
      title: {
        text: 'Limitations',
      },
      series: [{
        name: 'target',
        type: 'line',
        id: 'target',
        data: [{
          x: 0,
          y: 0,
        }],
      }, {
        name: 'max',
        type: 'line',
        id: 'max',
        data: [{
          x: 0,
          y: 0,
        }],
      }],
      tooltip: {
        formatter(): string {
          return `X1: ${this.x.toFixed(3)} X2: ${this.y.toFixed(3)}`;
        },
      },
    });

    this.chartSubscription = combineLatest([this.dataTransferService.getTargetFunctionStream(), this.chart.ref$])
      .pipe(auditTime(2000))
      .subscribe(([params, charts]) => {
        const targetFunction = this.graphService.createTargetFunction(params);
        charts.options.tooltip.formatter = function(): string {
          return `Target function: ${targetFunction(this).toFixed(3)} <br>
            X1: ${this.x.toFixed(3)} X2: ${this.y.toFixed(3)}`;
        };

        charts.update({
            series: [{
              name: 'target',
              type: 'line',
              id: 'target',
              data: [{
                x: 0,
                y: 0,
              }, {
                x: params.X1,
                y: params.X2,
              }],
            }, {
              name: 'max',
              type: 'line',
              id: 'max',
              data: [{
                x: 0,
                y: params.X2 + params.X1 *  params.X1 / params.X2,
              }, {
                x: params.X1 + params.X2 * params.X2 / params.X1,
                y: 0,
              }],
            }],
        });
        // setTimeout(() => {
        //   (charts.get('max') as any).addPoint({
        //     x: params.X1,
        //     y: params.X2,
        //   });
        // // tslint:disable-next-line: no-magic-numbers
        // }, 3000);
      });

    this.dataTransferService.getLineStream()
      .subscribe((line: ILine) => {
        this.graphService.createSerie(this.chart, line);
    });
  }
}

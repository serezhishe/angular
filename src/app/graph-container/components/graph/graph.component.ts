import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { combineLatest, Subscription } from 'rxjs';
import { auditTime, last } from 'rxjs/operators';

import { ILimitation } from '../../models/group.model';
import { DataTransferService } from '../../services/data-transfer.service';
import { GraphService } from '../../services/graph.service';

const ANIMATION_DURATION = 2000;
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  public chart: Chart;
  public chart2: Chart;
  private chartSubscription: Subscription;

  public constructor(public graphService: GraphService, private readonly dataTransferService: DataTransferService) {}

  public ngOnDestroy(): void {
    this.chartSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.chart = new Chart({
      chart: {
        animation: {
            duration: ANIMATION_DURATION,
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
        shared: false,
        formatter(): string {
          return `X1: ${this.x.toFixed(3)} X2: ${this.y.toFixed(3)}`;
        },
      },
    });

    this.chart2 = new Chart({
      chart: {
        animation: {
            duration: ANIMATION_DURATION,
        },
        type: 'area',
      },
      title: {
        text: 'weqweqwe',
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
      }, {
        name: 'big',
        type: 'line',
        id: 'big',
        data: [{
          x: 0,
          y: 0,
        }],
      }, {
        name: 'common',
        type: 'line',
        id: 'common',
        data: [{
          x: 0,
          y: 0,
        }],
      }],
      tooltip: {
        shared: false,
        formatter(): string {
          return `X1: ${this.x.toFixed(3)} X2: ${this.y.toFixed(3)}`;
        },
      },
    });

    this.chartSubscription = combineLatest([this.dataTransferService.getTargetFunctionStream(), this.chart.ref$, this.chart2.ref$])
      .pipe(auditTime(ANIMATION_DURATION))
      .subscribe(([params, charts, charts2]) => {
        const targetFunction = this.graphService.createTargetFunction(params);
        charts.options.tooltip.formatter = function(): string {
          return `Target function: ${targetFunction(this).toFixed(3)} <br>
            X1: ${this.x.toFixed(3)} X2: ${this.y.toFixed(3)}`;
        };

        charts2.options.tooltip.formatter = function(): string {
          return `Target function: ${targetFunction(this).toFixed(3)} <br>
            X1: ${this.x.toFixed(3)} X2: ${this.y.toFixed(3)}`;
        };
        setTimeout(() => {
          this.graphService.createBiggestLine(this.chart2);
        }, ANIMATION_DURATION);

        (charts as any).get('target').update({
          data: [{
            x: 0,
            y: 0,
          }, {
            x: params.X1,
            y: params.X2,
          }],
        });
        (charts as any).get('max').update({
          data: [{
            x: 0,
            y: params.X2 + params.X1 *  params.X1 / params.X2,
          }, {
            x: params.X1 + params.X2 * params.X2 / params.X1,
            y: 0,
          }],
        });
        (charts2 as any).get('big').update({
          data: [{
            x: 0,
            y: params.X2 + params.X1 *  params.X1 / params.X2,
          }, {
            x: params.X1 + params.X2 * params.X2 / params.X1,
            y: 0,
          }],
        }, false, false);
        (charts2 as any).get('target').update({
          data: [{
            x: 0,
            y: 0,
          }, {
            x: params.X1,
            y: params.X2,
          }],
        });
        (charts2 as any).get('max').update({
          data: [{
            x: 0,
            y: params.X2 + params.X1 *  params.X1 / params.X2,
          }, {
            x: params.X1 + params.X2 * params.X2 / params.X1,
            y: 0,
          }],
        });
      });

    this.dataTransferService.getLineStream()
      .subscribe((line: ILimitation) => {
        this.graphService.createSerie(this.chart.ref$.pipe(last()), line, this.chart2);
    });
  }
}

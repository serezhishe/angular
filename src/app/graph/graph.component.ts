import { ILine } from './../shared/models/line.model';
import { DataTransferService } from './../shared/services/data-transfer.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { GraphService } from './graph.service';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  public chart: Chart;

  constructor( public graphService: GraphService, private dataTransferService: DataTransferService ) {}

  ngOnInit() {
    this.chart = new Chart({
      chart: {
        type: 'area',
      },
      title: {
        text: 'Limitations'
      },
      series: [{
        name: '',
        type: 'line',
        data: [{
          x: 0,
          y: 0,
        }],
      }],
      tooltip: {
        formatter() {
          return 'X1: ' + this.x.toFixed(3) + ' X2: ' + this.y.toFixed(3);
        }
      }
    });

    this.dataTransferService.getTargetFunctionStream()
      .subscribe((params) => {
        const targetFunction = this.graphService.createTargetFunction(params);
        this.chart = new Chart({
        chart: {
          type: 'area',
        },
        title: {
          text: 'Limitations'
        },
        series: [{
          name: '',
          type: 'line',
          data: [{
            x: 0,
            y: 0,
          }, {
            x: params.X1,
            y: params.X2,
          }],
        }, {
          name: '123',
          type: 'line',
          data: [{
            x: 0,
            y: params.X2 + params.X1 *  params.X1 / params.X2,
          }, {
            x: params.X1,
            y: params.X2,
          }, {
            x: params.X1 + params.X2 * params.X2 / params.X1,
            y: 0,
          }]
        }],
          tooltip: {
            formatter() {
              return 'Target function: ' + targetFunction(this).toFixed(3) + '<br>' +
              'X1: ' + this.x.toFixed(3) + ' X2: ' + this.y.toFixed(3);
            }
          }
        });
        this.graphService.updateSeries(this.chart);
      });

    this.dataTransferService.getLineStream().subscribe((line: ILine) => {
      if (this.chart) {
        this.graphService.createSerie(this.chart, line);
      }
    });
  }

}

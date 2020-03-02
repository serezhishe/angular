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
    });
    this.dataTransferService.getTargetFunctionStream()
      .pipe(
        distinctUntilChanged(),
        map(params => this.graphService.createTargetFunction(params))
      )
      .subscribe((targetFunction) => {
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
              return 'Target function: ' + targetFunction(this);
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

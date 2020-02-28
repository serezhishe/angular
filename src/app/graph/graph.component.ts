import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Line } from '../line.model';
import { GraphService } from './graph.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit, OnChanges {
  public chart: Chart;
  @Input() line: Line;
  constructor( public graphService: GraphService) {}
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
      }]
    });
  }

  ngOnChanges({line: {currentValue}}: SimpleChanges): void {
    if (this.chart) {
      this.graphService.createSerie(this.chart, currentValue);
    }
  }
}

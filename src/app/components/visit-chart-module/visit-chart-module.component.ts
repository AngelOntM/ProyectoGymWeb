import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import { UserService } from '../../userservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-visit-chart-module',
  templateUrl: './visit-chart-module.component.html',
  styleUrls: ['./visit-chart-module.component.css']
})
export class VisitChartModuleComponent implements OnInit {
  visitData$!: Observable<any>;
  chartOption: any;

  private apiURL = environment.apiURL
  private currentUser: any;// Cambia esto por el token de tu usuario
  dateForm!: FormGroup;

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getLoggedInUser();
    this.createForm();
    //this.loadVisitData();
  }

  createForm() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dateForm = this.fb.group({
      firstDate: [startOfMonth, [Validators.required, this.dateRangeValidator.bind(this)]],
      endDate: [endOfMonth, [Validators.required, this.dateRangeValidator.bind(this)]]
    });
  }

  dateRangeValidator(control: any) {
    const startDate = this.dateForm?.get('firstDate')?.value;
    const endDate = this.dateForm?.get('endDate')?.value;
    return startDate && endDate && endDate < startDate ? { dateRange: true } : null;
  }

  loadVisitData(): void {
    if (this.dateForm.invalid) {
      return;
    }
    const { firstDate, endDate } = this.dateForm.value;
    this.visitData$ = this.http.get<any>(`${this.apiURL}/visits`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      },
      params: {
        start_date: firstDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });

    this.visitData$.subscribe(data => {
      this.processData(data);
    });
  }

  processData(data: any): void {
    const visitsPerDay = data.reduce((acc: any, item: any) => {
      const date = item.visit_date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    const dates = Object.keys(visitsPerDay);
    const counts = Object.values(visitsPerDay);

    this.chartOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'bottom'
      },
      series: [
        {
          name: 'Visitas',
          type: 'pie',
          radius: '80%',
          data: dates.map((date: string, index: number) => ({
            name: date,
            value: counts[index]
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
}

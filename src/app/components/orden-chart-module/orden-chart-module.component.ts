import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import { UserService } from '../../userservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-orden-chart-module',
  templateUrl: './orden-chart-module.component.html',
  styleUrls: ['./orden-chart-module.component.css']
})
export class OrdenChartModuleComponent implements OnInit {
  chartOption: any;

  private apiURL = environment.apiURL;
  private currentUser: any;
  dateForm!: FormGroup;

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getLoggedInUser();
    this.createForm();
    //this.loadOrderData();
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

  loadOrderData(): void {
    if (this.dateForm.invalid) {
      return;
    }
    const { firstDate, endDate } = this.dateForm.value;
    this.http.get<any>(`${this.apiURL}/orders`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      },
      params: {
        start_date: firstDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    }).subscribe(data => {
      this.processData(data);
    });
  }

  processData(data: any): void {
    // Agrupando los datos por fecha y sumando los totales
    const earningsPerDay = data
      .filter((item: any) => item.estado === 'Pagada') // Filtrar solo órdenes pagadas
      .reduce((acc: any, item: any) => {
        const date = item.order_date.split(' ')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += parseFloat(item.total_amount);
        return acc;
      }, {});

    const dates = Object.keys(earningsPerDay);
    const earnings = Object.values(earningsPerDay);

    this.chartOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: 45 // Rotar etiquetas si es necesario
        }
      },
      yAxis: {
        type: 'value',
        name: 'Ganancia',
        axisLabel: {
          formatter: '{value} $'
        }
      },
      series: [
        {
          name: 'Ganancias',
          type: 'bar',
          data: earnings,
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
  }
}

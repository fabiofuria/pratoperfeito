import { Component, OnInit } from '@angular/core';
import { OrderDetailsService } from '../../services/order-details.service';
OrderDetailsService


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

      foodData: any[] = [];
    
      constructor(private orderService: OrderDetailsService) { }
    
      ngOnInit(): void {
        this.orderService.getFoodData().subscribe((data) => {
          this.foodData = data;
        });
      }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailsService } from 'src/app/services/order-details.service';

@Component({
  selector: 'app-menupage',
  templateUrl: './menupage.component.html',
  styleUrls: ['./menupage.component.css']
})
export class MenupageComponent implements OnInit {

  constructor(private param: ActivatedRoute, private service: OrderDetailsService) { }
  getMenuId: any;
  menuData: any[] | null = null;


  ngOnInit(): void {
    this.getMenuId = this.param.snapshot.paramMap.get('id');
    if (this.getMenuId) {
      this.service.getFoodData().subscribe((data) => {
        // Aqui, filtramos os dados com base no ID
        this.menuData = data.filter((value) => {
          return value.id == this.getMenuId;
        });
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailsService } from 'src/app/services/order-details.service';
import { MenupageDetailsService } from 'src/app/services/menupage-details.service';

@Component({
  selector: 'app-menupage',
  templateUrl: './menupage.component.html',
  styleUrls: ['./menupage.component.css']
})
export class MenupageComponent implements OnInit {

  constructor(private param: ActivatedRoute, private service: OrderDetailsService, private Menuservice: MenupageDetailsService) { }
  getMenuId: any;
  menuData: any[] | null = null;
  menuIngredients: any[] = [];
  menuPreparation: any[] = [];

  ngOnInit(): void {
    this.getMenuId = this.param.snapshot.paramMap.get('id');

    if (this.getMenuId) {
      this.service.getFoodData(this.getMenuId).subscribe((data) => {
        this.menuData = data
      });

      this.Menuservice.getIngredientsData(this.getMenuId).subscribe((data) => {
        this.menuIngredients = data
      });

      this.Menuservice.getPreparationData(this.getMenuId).subscribe((data) => {
        this.menuPreparation = data
      });
    }
  }
}

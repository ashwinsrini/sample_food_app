import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cardHover: Boolean = false;
  items: any = [];

  constructor(
    public homeServ: HomeService,
  ) { }

  ngOnInit(): void {
    this.homeServ.getDishes().subscribe(res => {
      this.items = res.data;
    });
  }

  addToCart(item: any) {
    this.homeServ.addToCart(item);
  }

}

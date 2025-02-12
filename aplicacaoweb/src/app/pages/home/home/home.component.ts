import { Component } from '@angular/core';
import { HeaderComponent } from "../homePages/header/header.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

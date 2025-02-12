import { Component } from '@angular/core';
import { HeaderComponent } from "../homePages/header/header.component";
import { HomeContentComponent } from "../homePages/home-content/home-content.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, HomeContentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

import { Component } from '@angular/core';
import { HeaderComponent } from "../homePages/header/header.component";
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../homePages/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [HeaderComponent, RouterModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

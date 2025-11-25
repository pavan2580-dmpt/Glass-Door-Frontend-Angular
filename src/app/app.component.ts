import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Glass House';

  ngOnInit(): void {
    // this.checkExpiration();
  }

  checkExpiration(): void {
    const expirationTime = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
    const now = new Date().getTime();
    const firstRunTime = localStorage.getItem('firstRunTime');

    if (!firstRunTime) {
      localStorage.setItem('firstRunTime', now.toString());
    } else {
      const elapsedTime = now - parseInt(firstRunTime, 10);
      if (elapsedTime > expirationTime) {
        this.disableApp();
      }
    }
  }

  disableApp(): void {
    document.body.innerHTML =
      '<div class="expried shadow-sm bg-white rounded"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i><h4>This application has expired</h4><p>This application has expired. Please contact support.</p></div>';
  }
}

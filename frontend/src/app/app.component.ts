import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './services/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Neighbourhood Help';
  currentTime: string = '';
  private timer: any;

  constructor(
    public authService: AuthService, 
    public router: Router,
    public translate: TranslateService
  ) {
    // Localization Initialization
    const savedLang = localStorage.getItem('locale') || 'en';
    this.translate.addLangs(['en', 'te', 'ta']);
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('locale', lang);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSwitchRole() {
    const user = this.authService.currentUserValue;
    if (!user) return;

    const newRole = user.role === 'Resident' ? 'Helper' : 'Resident';

    if (confirm(`Switch to ${newRole} view?`)) {
      this.authService.switchRole(newRole).subscribe({
        error: (err) => alert('Failed: ' + err.message)
      });
    }
  }
}

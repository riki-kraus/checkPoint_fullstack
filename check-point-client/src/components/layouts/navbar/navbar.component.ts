
import { Component, OnInit, signal, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showProfileMenu = signal(false);
  scrolled = signal(false);

  currentUser = signal({
    name:  JSON.parse(localStorage.getItem('profile') || '{}').name||'אנונימי',
    email: '',
    avatar: JSON.parse(localStorage.getItem('profile') || '{}').picture || '/images/logo.png',
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.userProfile$.subscribe(profile => {
      if (profile) {
        this.currentUser.set({
          name: profile.name,
          email: profile.email,
          avatar: profile.picture || '/images/logo.png',
        });
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const profileElement = document.querySelector('.user-profile');
      if (profileElement && !profileElement.contains(target)) {
        this.showProfileMenu.set(false);
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleProfileMenu(): void {
    this.showProfileMenu.update(current => !current);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToProfile(): void {
    this.showProfileMenu.set(false);
  }


  signOut(): void {
    this.showProfileMenu.set(false);
    this.authService.clearUserProfile(); 
    this.authService.logout();
    window.location.reload();

  }

  sendEmail() {
    const email = 'smaof5728@gmail.com';
    const subject = 'שלום המורה';
    const body = 'שלום, הנה תוכן ההודעה.';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }
}

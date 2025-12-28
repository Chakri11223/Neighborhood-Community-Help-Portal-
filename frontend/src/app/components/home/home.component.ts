import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  value: number;
  label: string;
  suffix: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  features: Feature[] = [
    {
      icon: 'groups',
      title: 'Community Driven',
      description: 'Connect with neighbours who care. Build lasting relationships while helping each other.'
    },
    {
      icon: 'verified_user',
      title: 'Safe & Secure',
      description: 'Verified users and secure platform ensure your safety and privacy at all times.'
    },
    {
      icon: 'flash_on',
      title: 'Quick Response',
      description: 'Get help fast! Our community members respond quickly to your requests.'
    },
    {
      icon: 'favorite',
      title: 'Give Back',
      description: 'Make a difference in your community. Help others and earn recognition.'
    }
  ];

  steps: Step[] = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up as a Resident or Helper in just a few clicks',
      icon: 'person_add'
    },
    {
      number: 2,
      title: 'Post or Browse',
      description: 'Post a help request or browse requests from neighbours',
      icon: 'search'
    },
    {
      number: 3,
      title: 'Connect & Help',
      description: 'Connect with helpers or offer your skills to those in need',
      icon: 'handshake'
    }
  ];

  stats: Stat[] = [
    { value: 0, label: 'Active Users', suffix: '+' },
    { value: 0, label: 'Requests Completed', suffix: '+' },
    { value: 0, label: 'Communities Served', suffix: '+' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initStatsObserver();
    this.initScrollReveal();
  }

  private initScrollReveal(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const revealElements = document.querySelectorAll('.reveal-hidden');
    revealElements.forEach(el => observer.observe(el));
  }

  private initStatsObserver(): void {
    const options = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);
  }

  animateStats(): void {
    const targets = [1250, 3400, 45];
    const duration = 2000;
    const frames = 60;
    const interval = duration / frames;

    this.stats.forEach((stat, index) => {
      const target = targets[index];
      let current = 0;
      let frame = 0;

      const counter = setInterval(() => {
        frame++;
        const progress = frame / frames;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        stat.value = Math.floor(target * easeOut);

        if (frame >= frames) {
          stat.value = target;
          clearInterval(counter);
        }
      }, interval);
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

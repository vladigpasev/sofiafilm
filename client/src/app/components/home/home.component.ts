import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf and ngFor
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,  // Standalone component
  imports: [FormsModule, CommonModule],  // Add FormsModule and CommonModule for ngModel and ngIf
})
export class HomeComponent implements OnInit {
  firstName: string = '';
  surname: string = '';
  email: string = '';
  phone: string = '';
  loading: boolean = false;  // Добавяме loading флаг

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // GSAP animation for event container
    gsap.from('.event-container', { duration: 1, opacity: 0, y: -20 });
  }

  // Open modal with animation
  openForm(): void {
    const modal = document.getElementById('ticketFormModal');
    if (modal) {
      modal.classList.remove('hidden');
      gsap.fromTo(modal, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    }
  }

  // Close modal with animation
  closeForm(): void {
    const modal = document.getElementById('ticketFormModal');
    if (modal) {
      gsap.to(modal, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power2.in', onComplete: () => modal.classList.add('hidden') });
    }
  }

  // Submit form and initiate Stripe session
  submitForm(): void {
    // Задаваме флага на loading = true, за да блокираме бутона
    this.loading = true;

    // Concatenate firstName and surname into one name field
    const fullName = `${this.firstName} ${this.surname}`;

    // Send request to server
    this.http.post('https://api.sofia-film.eventify.bg/stripe/create-checkout-session', {
      name: fullName,  // Full name is sent as expected by the server
      email: this.email,
      phone: this.phone,
    }).subscribe(
      (response: any) => {
        // Redirect to Stripe checkout
        window.location.href = response.url;
        this.loading = false;  // Нулираме loading флага след успешна заявка
      },
      (error) => {
        console.error('Error during checkout session creation:', error);
        this.loading = false;  // Нулираме loading флага при грешка
      }
    );
  }
}

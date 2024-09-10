import { Component } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {

  ngOnInit(): void {
    gsap.from('.success-message', { duration: 1, opacity: 0, y: 50 });
  }
}

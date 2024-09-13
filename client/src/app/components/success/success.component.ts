import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  ngOnInit(): void {
    gsap.from('.success-message', { duration: 1, opacity: 0, y: 50 });
    gsap.from('.success-container', { duration: 1.5, opacity: 0, scale: 0.8 });
  }
}

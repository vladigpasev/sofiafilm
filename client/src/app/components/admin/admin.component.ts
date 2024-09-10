import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
})
export class AdminComponent implements OnInit {
  orders: any[] = [];
  totalOrders: number = 0;
  approvedOrders: number = 0;
  disapprovedOrders: number = 0;
  unsetOrders: number = 0;  // New field for unset count
  token: string = '';
  showModal: boolean = false;
  selectedOrder: any;
  selectedStatus: string = '';
  verificationCodeInput: string = '';
  newStatus: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.fetchOrders();
    });
  }

  fetchOrders(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.get<any[]>('https://sofiafilm-production.up.railway.app/orders', { headers }).subscribe(
      (data: any[]) => {
        this.orders = data;

        // Compute total orders, approved orders, disapproved orders, and unset orders
        this.totalOrders = this.orders.length;
        this.approvedOrders = this.orders.filter(order => order.status === 'approved').length;
        this.disapprovedOrders = this.orders.filter(order => order.status === 'disapproved').length;
        this.unsetOrders = this.orders.filter(order => order.status === 'unset').length;

        gsap.from('.order-row', { duration: 1, opacity: 0, x: -50, stagger: 0.2 });
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  changeStatusByCode(): void {
    const foundOrder = this.orders.find(order => order.verificationCode === this.verificationCodeInput);

    if (!foundOrder) {
      alert('Order with the entered verification code was not found.');
      return;
    }

    if (foundOrder.status !== 'unset') {
      if (!confirm(`The current status is ${foundOrder.status}. Are you sure you want to change it to ${this.newStatus}?`)) {
        return;
      }
    }

    this.selectedOrder = foundOrder;
    this.selectedStatus = this.newStatus;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  confirmChange(): void {
    this.loading = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    
    this.http.patch(`https://sofiafilm-production.up.railway.app/orders/${this.selectedOrder._id}`, { status: this.selectedStatus }, { headers }).subscribe(
      (response) => {
        this.selectedOrder.status = this.selectedStatus;
        console.log(`Order ${this.selectedOrder._id} updated to ${this.selectedStatus}`);
        this.resetForm();  // Clear the form
        this.closeModal();
        this.loading = false;

        // Refresh the orders and stats after status change
        this.fetchOrders();
      },
      (error) => {
        console.error('Error updating order:', error);
        this.loading = false;
        this.closeModal();
      }
    );
  }

  // Clear the form after the status change
  resetForm(): void {
    this.verificationCodeInput = '';
    this.newStatus = '';
  }
}

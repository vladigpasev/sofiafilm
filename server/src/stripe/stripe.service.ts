import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  private frontendSuccessUrl: string;
  private frontendCancelUrl: string;

  constructor(
    private readonly ordersService: OrdersService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    this.frontendSuccessUrl = this.configService.get<string>('FRONTEND_SUCCESS_URL');
    this.frontendCancelUrl = this.configService.get<string>('FRONTEND_CANCEL_URL');
  }

  private generateVerificationCode(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();  // Генериране на 5-цифрен код
  }

  async createCheckoutSession(data: any, ticketPrice: number, connectedAccountId: string) {
    const session = await this.stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'bgn',
              product_data: {
                name: 'Event Ticket',
              },
              unit_amount: ticketPrice * 100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone,
        },
        customer_email: data.email,
        mode: 'payment',
        success_url: this.frontendSuccessUrl,
        cancel_url: this.frontendCancelUrl,
        payment_intent_data: {
          application_fee_amount: Math.round(ticketPrice * 0.1 * 100),
        },
      },
      {
        stripeAccount: connectedAccountId,  // Moved to the second argument
      }
    );
  
    return session;
  }  
  

  async handleWebhook(request: any, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        request.body,
        signature,
        this.webhookSecret
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;
  
    // Generate a 5-digit verification code
    const verificationCode = this.generateVerificationCode();
  
    // Create the order and pass inevent as false
    await this.ordersService.createOrder({
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      customerPhone: metadata.customerPhone,
      ticketPrice: 50, // Dynamic price handling can be implemented here
      paymentStatus: 'paid',
      status: 'unset',
      verificationCode,  // Adding the generated code
      inevent: false,  // Set default value for inevent
    });
  
    // Send confirmation email
    await this.emailService.sendConfirmationEmail(metadata.customerEmail, verificationCode);
  }
  
}

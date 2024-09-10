import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { StripeWebhookDto } from './dto/stripe-webhook.dto';
import { Request } from 'express';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @ApiBody({ type: CreateCheckoutSessionDto })
  @ApiResponse({ status: 201, description: 'Stripe Checkout session created successfully.' })
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto
  ) {
    const session = await this.stripeService.createCheckoutSession(
      createCheckoutSessionDto,
      50 // Dynamic pricing can be passed
    );
    return { url: session.url };
  }

  @Post('webhook')
  @ApiBody({ type: StripeWebhookDto })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully.' })
  async handleWebhook(
    @Req() request: Request,
    @Headers('stripe-signature') signature: string,
    @Body() stripeWebhookDto: StripeWebhookDto
  ) {
    await this.stripeService.handleWebhook(request, signature);
    return { status: 'success' };
  }
}

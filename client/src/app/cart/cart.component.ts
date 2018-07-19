import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { DataService } from "../data.service";
import { RestApiService } from "../rest-api.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  btnDisabled = false;
  handler: any;
  quantities = [];

  constructor(
    private data: DataService,
    private api: RestApiService,
    private router: Router
  ) { }

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data, index) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }

  ngOnInit() {
    this.cartItems.forEach(data => {
      this.quantities.push(1);
    });
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'assets/img/logo.png',
      locale: 'auto',
      token: async stripeToken => {
        let products;
        products = [];
        this.cartItems.forEach((d, index) => {
          products.push({
            product: d['_id'],
            quantity: this.quantities[index],
          });
        });

        try {
          const data = await this.api.post(
            'payment',
            {
              totalPrice: this.cartTotal,
              products,
              stripeToken,
            },
          );
          data['success']
            ? (this.data.clearCart(), this.data.successMessage('Purchase Successful.'))
            : this.data.errorMessage(data['message']);
        } catch (error) {
          this.data.errorMessage(error['message']);
        }
      },
    });
  }

  validate() {
    if (!this.quantities.every(data => data > 0)) {
      this.data.warningMessage('Quantity cannot be less than one.');
    } else if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']).then(() => {
        this.data.warningMessage('You need to login before making a purchase.');
      });
    } else if (!this.data.user['address']) {
      this.router.navigate(['/profile/address']).then(() => {
        this.data.warningMessage('You need to login before making a purchase.');
      });
    } else {
      this.data.message = '';
      return true;
    }
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: 'amazone_clone',
          description: 'Checkout Payment',
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false;
          },
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {
      this.data.errorMessage(error);
      this.btnDisabled = false;
    }
  }

}

document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {
      init() {

        axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
          .then((result) => {
            //console.log(result.data);
            this.pizzas = result.data.pizzas
          })
          .then(() => {
            return this.createCart();
          })
          .then((result) => {
            this.cartId = result.data.cart_code;
          });
      },

      createCart() {
        return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
      },

      showCart() {
        const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          });
      },

      pizzaImage(pizza) {
        console.log(pizza)
        return `./img/${pizza.size}.jpg`
      },

      message: 'Eating Pizzas',
      pizzas: [],
      username: '',
      cartId: '',
      cart: { total: 0 },
      paymentMessage: '',
      paymentAmount: 0,
      payNow: false,
      checkout: false,
      featuredItems: '',
      display: true,

      featuredPizzas() {
        axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
          .then((result) => {
            pizza.length <= 3   
          })
       
      },

      postfeaturedPizzas() {
        return
        axios
        .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },

      activeCart(){
        return
        axios
        .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/username/:username/active')
      },
    

    add(pizza) {
      //alert(JSON.stringify(pizza))
      //alert(pizza.flavour + " : " + pizza.size + " : " + pizza.id)
      const params = {
        cart_code: this.cartId,
        pizza_id: pizza.id
      }

      axios
        .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
        .then(() => {
          this.message = "Pizza added to the cart"
          this.showCart();
        })

        .catch(err => alert(err));

    },
    remove(pizza) {
      const params = {
        cart_code: this.cartId,
        pizza_id: pizza.id
      }

      axios
        .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
        .then(() => {
          this.message = "Pizza removed from the cart"
          this.showCart();
        })

        .catch(err => alert(err));

    },

    pay() {
      const params = {
        cart_code: this.cartId,
      }
      axios
        .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
        .then(() => {
          if (!this.paymentAmount) {
            this.paymentMessage = 'No Amount Entered!'
          }

          else if (this.paymentAmount >= this.cart.total.toFixed(2)) {
            this.paymentMessage = 'Payment Successful! '
            this.message = this.username + "Paid!"
            setTimeout(() => {
              this.cart.total = 0;
              this.paymentMessage = '';
              this.paymentAmount = 0;
              this.message = '';

            }, 3000);

          } else {
            this.paymentMessage = 'Sorry, insufficient amount!'
          }
        });
    }

  }

  })
});

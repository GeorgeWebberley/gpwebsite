"use strict";

// ---- ASSIGNMENT OF VARIABLES TO QUERY SELECTORS ---- //

const checkoutBtn = document.querySelector(".checkout");
const cartBtn = document.querySelector(".cart-btn");
const modifyBtn = document.querySelector(".modify-btn");
const addBtn = document.querySelector(".add-item");
const closeCartBtn = document.querySelector(".close-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const numberInCart = document.querySelector(".number-in-cart");
const Total = document.querySelector(".total");
const cartContent = document.querySelector(".cart-content");
const amount = document.querySelector(".item-amount");
const checkoutSummary = document.querySelector(".checkout-summary");
const closeMessage = document.querySelector(".message-close");
const message = document.querySelector(".message");
const orderTotal = document.querySelector(".order-total");
const itemTotal = document.querySelector(".item-total");
const postage = document.querySelector(".postage");

let cart = [];
let add2CartButtons = [];

// ---- BUTTON EVENT LISTENERS ---- //

//modify cart button open cart
if (modifyBtn != null) {
  modifyBtn.addEventListener("click", () => {
    showCart();
  });
}
// Opens cart
cartBtn.addEventListener("click", () => {
  showCart();
});
// Closes cart
closeCartBtn.addEventListener("click", () => {
  hideCart();
});
// Goes to checkout
checkoutBtn.addEventListener("click", () => {
  cart.forEach(item => this.addCartItem(item, checkoutSummary));
});
// Closes the cart when clicked outside the cart window
cartOverlay.addEventListener("click", event => {
  if (!cartDOM.contains(event.target)) {
    hideCart();
  }
});
// Closes messages
if (closeMessage != null) {
  closeMessage.addEventListener("click", () => {
    hideMessage();
  });
}
// Hides message
function hideMessage() {
  message.classList.add("hide-message");
}



// ---- ADD TO CART AND CART CONTROL FUNCTIONS ---- //

// Shows cart
function showCart() {
  cartOverlay.classList.add("transparentBackground");
  cartDOM.classList.add("showCart");
}
// Hides cart
function hideCart() {
  cartOverlay.classList.remove("transparentBackground");
  cartDOM.classList.remove("showCart");
}

// Function that loads product details from item into JSON object which is added
// to cart array and stored in local storage
function add2Cart() {
  const buttons = [...document.querySelectorAll(".add-to-basket")];
  add2CartButtons = buttons;
  buttons.forEach(button => {
    let id = button.dataset.id;
    let inCart = cart.find(item => item.id === id);

    if (inCart) {
      button.innerText = "In Cart";
      button.disabled = true;
    }
    // For each add to cart button that is clicked pull item data and load into
    // product json which is loaded into cart array
    button.addEventListener("click", event => {
      event.target.innerText = "In Cart";
      event.target.disabled = true;

      let name = button.dataset.name;
      let price = button.dataset.price;
      let imageName = button.dataset.image;
      let id = button.dataset.id;
      let product = {
        id: id,
        name: name,
        price: price,
        image: imageName,
        amount: 1,
        amountid: id
      };
      cart = [...cart, product];
      Storage.saveCart(cart);
      addCartItem(product, cartContent);
      showCart();
    });
  });
}

// Save or retrieve cart array of JSON product objects from local storage
class Storage {
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    // If return local storage has cart return it, else return empty array
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

// function to populate cart with new cart item
// item corresponds to product JSON object
function addCartItem(item, destination) {
  const section = document.createElement("section");
  section.classList.add("cart-product");
  section.innerHTML = `
    <div class="product-image-wrapper">
      <img src="/db_images/${item.image}" alt="image of a ring" />
    </div>
    <div class="product-info-wrapper">
      <div class="product-info">
        <div>${item.name}</div>
        <div class="quantity-control">
        <span>QTY / </span>
          <span class="qty qty-sub" data-id=${item.id}>-</span>
          <span class="item-amount"  data-id=${item.amountid}>${item.amount}</span>
          <span class="qty qty-add" data-id=${item.id} >+</span>
        </div>
        <div class="remove-item" data-id=${item.id}>remove</div>
      </div>
      <div class="product-price">£${item.price}</div>

    </div>
`;

  destination.appendChild(section);
  if (section.previousElementSibling != null) {
    section.style.borderTop = "white";
  }
  updateCart(cart);
}

// Function that deals with cart item controls (QTY and remove)
function cartController() {
  cartContent.addEventListener("click", event => {
    // If remove is pressed
    if (event.target.classList.contains("remove-item")) {
      cartContent.removeChild(
        event.target.parentElement.parentElement.parentElement
      );
      removeItem(event.target.dataset.id);
      updateCart(cart);
      // If QTY + is pressed ...
    } else if (event.target.classList.contains("qty-add")) {
      let addAmount = event.target;
      let id = addAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount += 1;
      Storage.saveCart(cart);
      addAmount.previousElementSibling.innerText = tempItem.amount;
      updateCart(cart);
      // if QTY - is pressed ....
    } else if (event.target.classList.contains("qty-sub")) {
      let lowerAmount = event.target;
      let id = lowerAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount -= 1;
      if (tempItem.amount > 0) {
        Storage.saveCart(cart);
        lowerAmount.nextElementSibling.innerText = tempItem.amount;
        updateCart(cart);
        // remove item from cart if QTY reduced to 0
      } else {
        cartContent.removeChild(
          lowerAmount.parentElement.parentElement.parentElement.parentElement
        );
        removeItem(event.target.dataset.id);
        console.log("here");
        updateCart(cart);
      }
    }
  });
}
// This function updates the cart and checkout page values
function updateCart(cart) {
  let tempTotal = 0;
  let tempPostage = 0;
  let tempOrderTotal = 0;
  let itemsTotal = 0;

  cart.map(item => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });

  tempTotal = parseFloat(tempTotal.toFixed(2));

  // Postage set here - can increase postage for more items by adding condition
  if (itemsTotal > 0) {
    tempPostage = 4.99;
  }

  tempOrderTotal = tempTotal + tempPostage;
  tempOrderTotal = parseFloat(tempOrderTotal.toFixed(2));
  // Set cart values
  Total.innerText = tempTotal;
  numberInCart.innerText = itemsTotal;
  // Set checkout page values
  if (modifyBtn != null) {
    itemTotal.innerText = "£ " + tempTotal;
    postage.innerText = "£ " + tempPostage;
    orderTotal.innerText = "£ " + tempOrderTotal;
  }
}

// Remove item from cart and re-enable add to cart button on item
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  Storage.saveCart(cart);
  let button = add2CartButtons.find(button => button.dataset.id === id);
  if (button != undefined) {
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i> <p>ADD TO BASKET</p>`;
  }
}

//ON LOAD OF DOM:
// get cart array from storage, display each cart item in the cart, run the cart logic controller
document.addEventListener("DOMContentLoaded", () => {
  cart = Storage.getCart();
  add2Cart();
  cart.forEach(item => this.addCartItem(item, cartContent));
  cartController();
});

// ---- HOME PAGE CAROUSEL ---- //

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

// Slide Logic
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block";
  }
}

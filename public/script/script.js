const cartBtn = document.querySelector(".cart-btn");
const addBtn = document.querySelector(".add-item");
const closeCartBtn = document.querySelector(".close-cart");

let cart = [];
let add2CartButtons = [];


function add2Cart() {
  const buttons = [...document.querySelectorAll(".item-btn")];
  add2CartButtons = buttons;
  buttons.forEach(button => {

    let id = button.dataset.id;
    let inCart = cart.find(item => item.id === id);

    if (inCart) {
      button.innerText = 'In Cart';
      button.disabled = true;
    }

    button.addEventListener("click", (event) => {
      event.target.innerText = 'In Cart';
      event.target.disabled = true;

      let name = button.dataset.name;
      let price = button.dataset.price;
      let imageName = button.dataset.image;
      let id = button.dataset.id;
      let product = { id: id, name: name, price: price, image: imageName, amount: 1, amountid: id };
      cart = [...cart, product];
      Storage.saveCart(cart);
      addCartItem(product);
      showCart();

    });
  });
}

class Storage {

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
  }
}

//SHOPPING CART//
//variables

cartBtn.addEventListener("click", () => {
  showCart();
})

closeCartBtn.addEventListener("click", () => {
  hideCart();
})

function showCart() {
  cartOverlay.classList.add("transparentBackground");
  cartDOM.classList.add("showCart");
}

function hideCart() {
  cartOverlay.classList.remove("transparentBackground");
  cartDOM.classList.remove("showCart");
}


function addCartItem(item) {
  const div = document.createElement("div");
  div.classList.add("cart-product");
  div.innerHTML = `
    <div class="product-image-wrapper">
      <img src="/db_images/${item.image}" alt="image of a ring" />
    </div>
    <div class="product-info-wrapper">
      <div class="product-info">
        <div>${item.name}</div>
        <div class="remove-item" data-id=${item.id}>remove</div>
        <div>

          <span class="qty qty-sub" data-id=${item.id}>-</span>
          <div class="item-amount" data-id=${item.amountid}>${item.amount}<div>
          <span class="qty qty-add" data-id=${item.id} >+</span>

        </div>
      </div>
      <div class="product-price">£${item.price}</div>

    </div>
`;
  cartContent.appendChild(div);
}

function cartLogic() {
  cartContent.addEventListener("click", event => {

    if (event.target.classList.contains("remove-item")) {
      cartContent.removeChild(event.target.parentElement.parentElement.parentElement);
      removeItem(event.target.dataset.id)
    }
  }
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  Storage.saveCart(cart);
  let button = add2CartButtons.find(button => button.dataset.id === id);
  button.disabled = false;
  button.innerHTML = `<i class="fas fa-shopping-cart"></i> ADD TO BASKET`;
}


document.addEventListener('DOMContentLoaded', () => {

  cart = Storage.getCart();
  console.log(cart);
  add2Cart();
  cart.forEach(item => this.addCartItem(item));
  cartLogic();

})


//CAROUSEL
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

  slides[slideIndex - 1].style.display = "block";
}
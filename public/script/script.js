const cartBtn = document.querySelector(".cart-btn");
const addBtn = document.querySelector(".add-item");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

let cart = [];
let buttonsDOM = [];

const buttons = [...document.querySelectorAll(".item-btn")];
buttonsDOM = buttons;
buttons.forEach(button => {

  let id = button.dataset.id;
  let inCart = cart.find(item => item.id === id);

  console.log(inCart);

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
    let product = { id: id, name: name, price: price, image: imageName, };
    cart = [...cart, product];
    Storage.saveCart(cart);
    addCartItem(product);
    showCart();

    console.log(cart);



  });
});



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
  removeCart();
})

function showCart() {
  cartOverlay.classList.add("transparentBackground");
  cartDOM.classList.add("showCart");
}

function removeCart() {
  cartOverlay.classList.remove("transparentBackground");
  cartDOM.classList.remove("showCart");
}
// cartOverlay.addEventListener('click', () => {
//   cartOverlay.classList.remove('transparentBackground');
//   cartDOM.classList.remove('showCart');
// })

function addCartItem(item) {
  const div = document.createElement("div");
  div.classList.add("cart-product");
  div.innerHTML = `
    <div class="product-image-wrapper">
      <img src="/db_images/${item.image}" alt="image of a ring" />
    </div>
    <div class="product-info-wrapper">
      <div class="product-info">
        <div>${item.title}</div>
        <div>size</div>
        <div class="remove-item" data-id=${item.id}>remove</div>
        <div>

          <span class="qty qty-sub" data-id=${item.id}>-</span>
                  ${item.amount}
                  <span class="qty qty-sub" data-id=${item.id} >+</span>

        </div>
      </div>
      <div class="product-price">£${item.price}</div>

    </div>
`;
  cartContent.appendChild(div);
}

addBtn.addEventListener("click", () => {
  console.log("here");
  addCartItem({
    image: "images/Cart-example.png",
    title: "Plain Ring",
    id: 2,
    amount: 3,
    id: 4,
    id: 5,
    price: 150
  });
});

function cartLogic() {
  clearCartBtn.addEventListener("click", () => this.clearCart());
  cartContent.addEventListener("click", event => {
    if (event.target.classList.contains("remove-item")) {
      let removeItem = event.target;
      let id = removeItem.dataset.id;
      cartContent.removeChild(removeItem.parentElement.parentElement);
      this.removeItem(id);
    } else if (event.target.classList.contains("qty-add")) {
      let addAmount = event.target;
      let id = addAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount = tempItem.amount + 1;
      Storage.saveCart(cart);
      this.setCartValues(cart);
      addAmount.nextElementSibling.innerText = tempItem.amount;
    } else if (event.target.classList.contains("qty-sub")) {
      let lowerAmount = event.target;
      let id = lowerAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount = tempItem.amount - 1;
      if (tempItem.amount > 0) {
        Storage.saveCart(cart);
        this.setCartValues(cart);
        lowerAmount.previousElementSibling.innerText = tempItem.amount;
      } else {
        cartContent.removeChild(lowerAmount.parentElement.parentElement);
        this.removeItem(id);
      }
    }
  });
}

cartLogic();

document.addEventListener('DOMContentLoaded', () => {

  setupAPP();
  products.getProducts().
    then(products => {
      ui.displayProducts(products)
      Storage.saveProducts(products);
    }).
    then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });

});


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
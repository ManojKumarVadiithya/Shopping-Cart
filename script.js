//Products
const products = [
    { id: 1, name: "Stylish T-shirt", price: 29.99, img: "images/t-shirt.jpg" },
    { id: 2, name: "Modern Watch", price: 149.99, img: "images/watch.jpg" },
    { id: 3, name: "Leather Backpack", price: 89.99, img: "images/backpack.jpg" },
    { id: 4, name: "Sun Glasses", price: 49.99, img: "images/sun glasses.jpg" },
    { id: 5, name: "Shoes", price: 79.99, img: "images/black shoes.jpg" },
    { id: 6, name: "Pen", price: 9.99, img: "images/pen.jpg" },
    { id: 7, name: "Winter Jacket", price: 59.99, img: "images/winter jacket.jpg" },
    { id: 8, name: "Trolly Bag", price: 99.99, img: "images/trolly bag.jpg" },
    { id: 9, name: "Volley Ball", price: 24.99, img: "images/volleyball.jpg" },
    { id: 10, name: "Wired Earphones", price: 19.99, img: "images/wired earphones.jpg" },
];

//State Management
const state = {
    cart: {},
    isCartOpen: false
};

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    renderProducts();
    attachEventListeners();
}

function attachEventListeners() {
    const cartToggleBtn = document.getElementById("cartToggleBtn");
    const cartCloseBtn = document.getElementById("cartCloseBtn");

    cartToggleBtn.addEventListener("click", toggleCartSidebar);
    cartCloseBtn.addEventListener("click", toggleCartSidebar);
}

function toggleCartSidebar() {
    state.isCartOpen = !state.isCartOpen;
    const cartSidebar = document.getElementById("cartSidebar");
    const mainContent = document.getElementById("mainContent");

    if (state.isCartOpen) {
        cartSidebar.classList.add("open");
        mainContent.classList.add("shrink");
    } else {
        cartSidebar.classList.remove("open");
        mainContent.classList.remove("shrink");
    }
}

//Products Rendering
function renderProducts() {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsList.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const content = `
        <img src="${product.img}" alt="${product.name}" class="product-image">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="btn-add-cart" data-product-id="${product.id}">Add to Cart</button>
    `;

    card.innerHTML = content;

    // Attach event listener to Add to Cart button
    const addBtn = card.querySelector(".btn-add-cart");
    addBtn.addEventListener("click", () => addProductToCart(product.id));

    return card;
}

//Cart
function addProductToCart(productId) {
    if (!state.cart[productId]) {
        const product = products.find(p => p.id === productId);
        state.cart[productId] = {
            ...product,
            quantity: 1
        };
    } else {
        state.cart[productId].quantity++;
    }

    updateCartDisplay();
}

function changeProductQuantity(productId, change) {
    if (state.cart[productId]) {
        state.cart[productId].quantity += change;

        if (state.cart[productId].quantity <= 0) {
            delete state.cart[productId];
        }

        updateCartDisplay();
    }
}

function updateCartDisplay() {
    renderCartItems();
    updateCartSummary();
    updateCartBadge();
}

function renderCartItems() {
    const cartItemsList = document.getElementById("cartItemsList");
    cartItemsList.innerHTML = "";

    const cartItems = Object.values(state.cart);

    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        return;
    }

    cartItems.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsList.appendChild(cartItem);
    });
}

function createCartItem(item) {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";

    const content = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="quantity-controls">
            <button class="btn-quantity" data-product-id="${item.id}" data-action="decrease">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="btn-quantity" data-product-id="${item.id}" data-action="increase">+</button>
        </div>
    `;

    itemElement.innerHTML = content;

    // Attach quantity control listeners
    const quantityBtns = itemElement.querySelectorAll(".btn-quantity");
    quantityBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const action = e.target.dataset.action;
            const change = action === "increase" ? 1 : -1;
            changeProductQuantity(productId, change);
        });
    });

    return itemElement;
}

function updateCartSummary() {
    const cartItems = Object.values(state.cart);
    let subtotal = 0;

    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const SHIPPING_COST = 5;
    const shipping = subtotal < 30  ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    document.getElementById("subtotalPrice").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("shippingPrice").textContent = `$${shipping.toFixed(2)}`;
    document.getElementById("totalPrice").textContent = `$${total.toFixed(2)}`;
}

function updateCartBadge() {
    const cartItems = Object.values(state.cart);
    let totalItems = 0;

    cartItems.forEach(item => {
        totalItems += item.quantity;
    });

    document.getElementById("cartItemCount").textContent = totalItems;
}

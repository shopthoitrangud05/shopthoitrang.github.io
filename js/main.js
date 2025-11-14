// Dữ liệu sản phẩm
const products = [
    {
        id: 1,
        name: "Áo thun Premium",
        price: 299000,
        description: "Áo thun cotton 100%, thoáng mát",
        emoji: "👕",
        badge: "HOT"
    },
    {
        id: 2,
        name: "Quần Jean Slim Fit",
        price: 499000,
        description: "Quần jean co giãn, form chuẩn",
        emoji: "👖",
        badge: "NEW"
    },
    {
        id: 3,
        name: "Giày Sneaker",
        price: 799000,
        description: "Giày thể thao năng động",
        emoji: "👟",
        badge: "SALE"
    },
    {
        id: 4,
        name: "Balo Laptop",
        price: 399000,
        description: "Balo chống nước, nhiều ngăn",
        emoji: "🎒",
        badge: null
    },
    {
        id: 5,
        name: "Mũ Snapback",
        price: 199000,
        description: "Mũ thời trang, chống nắng",
        emoji: "🧢",
        badge: "HOT"
    },
    {
        id: 6,
        name: "Túi Xách Nữ",
        price: 599000,
        description: "Túi da cao cấp, sang trọng",
        emoji: "👜",
        badge: "NEW"
    }
];

// Format giá tiền VND
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Render sản phẩm lên trang
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                ${product.emoji}
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(event, ${product.id})">
                    🛒 Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
}

// Xem chi tiết sản phẩm
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    alert(`${product.emoji} ${product.name}\n\nGiá: ${formatPrice(product.price)}\n\n${product.description}\n\nClick "Thêm vào giỏ" để mua hàng!`);
}

// Thêm vào giỏ hàng
function addToCart(event, productId) {
    event.stopPropagation(); // Ngăn không cho trigger viewProduct
    
    const product = products.find(p => p.id === productId);
    
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
    }
    
    // Lưu vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật badge số lượng
    updateCartBadge();
    
    // Hiển thị thông báo
    showNotification(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
}

// Cập nhật số lượng trên icon giỏ hàng
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Xử lý form liên hệ
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Giả lập gửi form
    const btn = event.target.querySelector('.submit-btn');
    btn.innerHTML = '<span class="loading"></span> Đang gửi...';
    btn.disabled = true;
    
    setTimeout(() => {
        showNotification(`✅ Cảm ơn ${name}! Chúng tôi đã nhận được tin nhắn của bạn.`);
        event.target.reset();
        btn.innerHTML = 'Gửi tin nhắn';
        btn.disabled = false;
    }, 2000);
}

// Smooth scroll
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Khởi động khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Render sản phẩm nếu có
    renderProducts();
    
    // Cập nhật badge giỏ hàng
    updateCartBadge();
    
    // Xử lý form liên hệ
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

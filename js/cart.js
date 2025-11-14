// Render giỏ hàng
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Giỏ hàng trống</h2>
                <p>Hãy thêm sản phẩm vào giỏ hàng!</p>
                <a href="products.html" class="cta-button">Mua sắm ngay</a>
            </div>
        `;
        updateCartSummary(cart);
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Xóa</button>
        </div>
    `).join('');
    
    updateCartSummary(cart);
}

// Format giá
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Cập nhật số lượng
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
    }
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
    
    showNotification('✅ Đã xóa sản phẩm khỏi giỏ hàng');
}

// Cập nhật tổng kết
function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 30000 : 0;
    const total = subtotal + shipping;
    
    const summaryContainer = document.getElementById('cart-summary');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <h2>Tổng đơn hàng</h2>
            <div class="summary-row">
                <span>Tạm tính:</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Phí vận chuyển:</span>
                <span>${formatPrice(shipping)}</span>
            </div>
            <div class="summary-row total">
                <span>Tổng cộng:</span>
                <span>${formatPrice(total)}</span>
            </div>
            <button class="submit-btn" onclick="checkout()" ${cart.length === 0 ? 'disabled' : ''}>
                Thanh toán
            </button>
        `;
    }
}

// Thanh toán
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 30000;
    
    const orderDetails = cart.map(item => 
        `${item.emoji} ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join('\n');
    
    alert(`🎉 Đặt hàng thành công!\n\n${orderDetails}\n\nPhí ship: 30.000đ\nTổng cộng: ${formatPrice(total)}\n\nChúng tôi sẽ liên hệ với bạn sớm!`);
    
    // Xóa giỏ hàng
    localStorage.removeItem('cart');
    renderCart();
    updateCartBadge();
}

// Cập nhật badge
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

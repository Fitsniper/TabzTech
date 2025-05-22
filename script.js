let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

function addToCart(productName) {
    // Find the product div for the clicked product
    const products = document.querySelectorAll('.product');
    let found = false;
    products.forEach(product => {
        const h2 = product.querySelector('h2');
        if (h2 && h2.textContent === productName) {
            const select = product.querySelector('select');
            if (select) {
                const selectedOption = select.options[select.selectedIndex].text;
                // Extract price from option text
                const match = selectedOption.match(/R\s?([\d\s]+)/i);
                let price = 0;
                if (match) {
                    price = parseFloat(match[1].replace(/\s/g, ''));
                }
                cartItems.push({ name: productName, option: selectedOption, price: price });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                renderCart();
                found = true;
            }
        }
    });
    if (!found) {
        alert('Could not determine price for selected product.');
    }
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function renderCart() {
    const cart = document.getElementById("cart");
    if (!cart) return;
    cart.innerHTML = "";
    let total = 0;

    cartItems.forEach((item, idx) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} (${item.option}) - R${item.price.toLocaleString()}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeFromCart(idx);
        li.appendChild(removeBtn);

        cart.appendChild(li);
        total += item.price;
    });

    let totalElem = document.getElementById("cart-total");
    if (!totalElem) {
        totalElem = document.createElement("div");
        totalElem.id = "cart-total";
        cart.parentNode.appendChild(totalElem);
    }
    totalElem.textContent = `Total: R${total.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', renderCart);

document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Gather order details
            let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            let orderDetails = cartItems.map(item => `${item.name} (${item.option}) - R${item.price.toLocaleString()}`).join('\n');
            let total = cartItems.reduce((sum, item) => sum + item.price, 0);

            // Gather customer details
            const form = e.target;
            const name = form.querySelector('input[placeholder="Name"]').value;
            const email = form.querySelector('input[placeholder="Email"]').value;
            const address = form.querySelector('input[placeholder="Shipping Address"]').value;
            const payment = form.querySelector('select').value;

            // Show confirmation
            document.getElementById('confirmation').textContent = "Order placed! Now send your order via email.";

            // Prepare mailto link
            const subject = encodeURIComponent("New Order from " + name);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nAddress: ${address}\nPayment: ${payment}\n\nOrder:\n${orderDetails}\n\nTotal: R${total.toLocaleString()}`
            );
            const mailtoLink = `mailto:aphiwembhele263@gmail.com?subject=${subject}&body=${body}`;

            // Show "Send Order via Email" button
            const sendEmailContainer = document.getElementById('sendEmailContainer');
            sendEmailContainer.innerHTML = '';
            const sendBtn = document.createElement('a');
            sendBtn.href = mailtoLink;
            sendBtn.textContent = "Send Order via Email";
            sendBtn.className = "send-email-btn";
            sendBtn.style.display = "inline-block";
            sendBtn.style.marginTop = "10px";
            sendBtn.style.padding = "10px 20px";
            sendBtn.style.background = "#007bff";
            sendBtn.style.color = "#fff";
            sendBtn.style.textDecoration = "none";
            sendBtn.style.borderRadius = "4px";
            sendEmailContainer.appendChild(sendBtn);

            // Clear cart
            localStorage.removeItem('cartItems');
            renderCart();
            form.reset();
        });
    }
});


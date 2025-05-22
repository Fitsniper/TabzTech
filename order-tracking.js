document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trackOrderForm');
  const statusDiv = document.getElementById('orderStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const orderID = document.getElementById('orderID').value;
    // Implement order tracking logic here
    statusDiv.textContent = `Status for Order ID ${orderID}: In Transit`;
  });
});
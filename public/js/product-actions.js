// public/js/product-actions.js
document.addEventListener('click', async (e) => {
  // add to bag
  if (e.target.matches('.add-bag')) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch('/api/products/' + id + '/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: 1 })
      });
      const data = await res.json();
      if (data.success) {
        // update cart count in UI if you expose it
        const el = document.getElementById('cart-count');
        if (el) el.textContent = data.cartCount ?? (Number(el.textContent||0)+1);
      } else {
        alert(data.message || 'Could not add to cart');
      }
    } catch (err) { console.error(err); alert('Network error'); }
  }

//   // wishlist toggle
//   if (e.target.matches('.wish')) {
//     const card = e.target.closest('.card');
//     const id = card?.dataset.id || e.target.dataset.id;
//     try {
//       const res = await fetch('/api/products/' + id + '/wishlist', { method: 'POST' });
//       const data = await res.json();
//       if (data.success) {
//         e.target.textContent = (e.target.classList.toggle('active')) ? '♥' : '♡';
//       }
//     } catch (err) { console.error(err); }
//   }
// });
// Wishlist toggle
  if (e.target.matches('.wish')) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch('/api/products/' + id + '/wishlist', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        e.target.classList.toggle('active');
        e.target.textContent = e.target.classList.contains('active') ? '♥' : '♡';
      } else {
        alert(data.message || 'Could not update wishlist');
      }
    } catch (err) {
      console.error(err);
    }
  }
});

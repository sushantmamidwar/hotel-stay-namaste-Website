// ============================================================
//  StayNamasté v2.0 — main.js
//  Features: Dark Mode, Chatbot, Wishlist, Compare, Loyalty,
//  Promo Codes, Reviews, Stats Counter, Language, Chef Timer
// ============================================================

// ---- DARK MODE ----
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('sn-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
if (darkToggle) {
  darkToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  darkToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sn-theme', next);
    darkToggle.innerHTML = next === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ---- HAMBURGER ----
// const hamburger = document.getElementById('hamburger');
// const navLinks = document.getElementById('nav-links');
// if (hamburger && navLinks) {
//   hamburger.addEventListener('click', () => {
//     hamburger.classList.toggle('open');
//     navLinks.classList.toggle('open');
//   });
// }

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close when any link is tapped
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
  // Close when tapping outside
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('navbar');
    if (nav && !nav.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// ---- HOTEL CITY FILTER ----
const cityTabs = document.querySelectorAll('.city-tab');
const hotelCards = document.querySelectorAll('.hotel-card');
cityTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    cityTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const city = tab.dataset.city;
    hotelCards.forEach(card => {
      const show = city === 'all' || card.dataset.city === city;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formSuccess.style.display = 'block';
    contactForm.reset();
    setTimeout(() => formSuccess.style.display = 'none', 5000);
  });
}

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));
}

// ---- ANIMATED STATS COUNTER ----
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const isK = el.classList.contains('counter-k');
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + (isK ? 'K+' : '');
    }, 16);
  });
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); statsObserver.disconnect(); } });
}, { threshold: 0.5 });
const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

// ---- ROOM BOOKING PRICE CALC ----
function calcRoomPrice() {
  const checkin  = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const roomType = document.getElementById('roomType');
  const priceEl  = document.getElementById('totalPrice');
  const nightsEl = document.getElementById('nightsCount');
  if (!checkin || !checkout || !roomType || !priceEl) return;
  const prices = { 'Deluxe Room':4999,'Suite Room':7999,'Executive Room':6499,'Family Room':5999,'Presidential Suite':14999 };
  const ci = new Date(checkin.value);
  const co = new Date(checkout.value);
  const nights = Math.max(1, Math.round((co - ci) / 86400000));
  const pricePer = prices[roomType.value] || 4999;
  const subtotal = nights * pricePer;
  // Apply promo discount
  const discount = parseInt(sessionStorage.getItem('promoDiscount') || '0');
  const discounted = Math.round(subtotal * (1 - discount / 100));
  const tax = Math.round(discounted * 0.12);
  if (nightsEl) nightsEl.textContent = `${nights} night${nights > 1 ? 's' : ''}`;
  priceEl.textContent = `₹${discounted.toLocaleString('en-IN')}`;
  const taxEl = document.getElementById('taxAmount');
  if (taxEl) taxEl.textContent = `₹${tax.toLocaleString('en-IN')}`;
  const grandEl = document.getElementById('grandTotal');
  if (grandEl) grandEl.textContent = `₹${(discounted + tax).toLocaleString('en-IN')}`;
}
['checkin','checkout','roomType'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', calcRoomPrice);
});

// ---- BOOKING FORM SUBMIT ----
const bookingForm = document.getElementById('bookingForm');
const bookingConfirm = document.getElementById('bookingConfirm');
const bookingFormCard = document.getElementById('bookingFormCard');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    // Award loyalty points
    const pts = Math.floor(Math.random() * 200) + 100;
    addLoyaltyPoints(pts);
    showLoyaltyToast(pts);
    saveDashboardBooking(bookingForm);
    if (bookingFormCard) bookingFormCard.style.display = 'none';
    if (bookingConfirm) bookingConfirm.style.display = 'block';
  });
}

// ---- ROOM SELECTOR CARDS ----
const roomSelectCards = document.querySelectorAll('.room-select-card');
roomSelectCards.forEach(card => {
  card.addEventListener('click', () => {
    roomSelectCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const rt = document.getElementById('roomType');
    if (rt) { rt.value = card.dataset.room; calcRoomPrice(); }
  });
});

// ---- PROMO CODES ----
const promoCodes = {
  'STAY20':    { discount: 20, msg: '🎉 20% discount applied!' },
  'FIRST50':   { discount: 50, msg: '🎊 50% first-booking discount!' },
  'EARLY30':   { discount: 30, msg: '✅ 30% Early Bird discount applied!' },
  'DINE15':    { discount: 15, msg: '🍽️ 15% dining discount applied!' },
  'BUNDLE25':  { discount: 25, msg: '🌟 25% bundle discount applied!' },
  'SUSHANT10': { discount: 10, msg: '👑 10% VIP discount applied!' },
};
window.applyPromo = function() {
  const input = document.getElementById('promoInput');
  const result = document.getElementById('promoResult');
  if (!input || !result) return;
  const code = input.value.trim().toUpperCase();
  if (promoCodes[code]) {
    const p = promoCodes[code];
    sessionStorage.setItem('promoDiscount', p.discount);
    result.innerHTML = `<span class="promo-success">${p.msg} (${p.discount}% off)</span>`;
    calcRoomPrice();
  } else {
    result.innerHTML = `<span class="promo-error">❌ Invalid promo code. Try: STAY20, FIRST50</span>`;
  }
};

// ---- WISHLIST ----
let wishlist = JSON.parse(localStorage.getItem('sn-wishlist') || '[]');
function updateWishlistCount() {
  const el = document.getElementById('wishlistCount');
  if (el) el.textContent = wishlist.length;
}
window.toggleWishlist = function(btn, hotelName) {
  const idx = wishlist.indexOf(hotelName);
  if (idx === -1) {
    wishlist.push(hotelName);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    btn.title = 'Remove from Wishlist';
  } else {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    btn.title = 'Save to Wishlist';
  }
  localStorage.setItem('sn-wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  renderWishlistSidebar();
};
function renderWishlistSidebar() {
  const el = document.getElementById('wishlistItems');
  if (!el) return;
  if (wishlist.length === 0) {
    el.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No saved hotels yet. Click the ❤️ on any hotel!</p>';
  } else {
    el.innerHTML = wishlist.map(h => `
      <div class="wishlist-item">
        <div>
          <div class="wishlist-item-name">${h}</div>
        </div>
        <a href="room_booking.html" class="btn-book" style="white-space:nowrap;font-size:0.78rem;padding:0.4rem 0.8rem">Book Now</a>
      </div>`).join('');
  }
}
window.toggleWishlistSidebar = function() {
  const sidebar = document.getElementById('wishlistSidebar');
  if (sidebar) sidebar.classList.toggle('open');
};

// Restore wishlist state on page load
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  const card = btn.closest('.hotel-card');
  if (!card) return;
  const name = card.querySelector('h3')?.textContent || '';
  if (wishlist.includes(name)) {
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
  }
});
updateWishlistCount();
renderWishlistSidebar();

// ---- COMPARE HOTELS ----
let compareList = [];
window.addToCompare = function(btn, name, price) {
  const idx = compareList.findIndex(h => h.name === name);
  if (idx !== -1) {
    compareList.splice(idx, 1);
    btn.classList.remove('added');
    btn.innerHTML = '<i class="fas fa-exchange-alt"></i> Compare';
  } else {
    if (compareList.length >= 3) { alert('You can compare up to 3 hotels at a time.'); return; }
    compareList.push({ name, price });
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
  }
  updateCompareBar();
};
function updateCompareBar() {
  const bar = document.getElementById('compareBar');
  const chips = document.getElementById('compareChips');
  if (!bar || !chips) return;
  if (compareList.length === 0) { bar.style.display = 'none'; return; }
  bar.style.display = 'block';
  chips.innerHTML = compareList.map((h, i) =>
    `<div class="compare-chip">${h.name} <span>${h.price}</span><button onclick="removeCompare(${i})">✕</button></div>`
  ).join('');
  // Save to session for compare page
  sessionStorage.setItem('sn-compare', JSON.stringify(compareList));
}
window.removeCompare = function(idx) {
  compareList.splice(idx, 1);
  updateCompareBar();
};
window.clearCompare = function() {
  compareList = [];
  document.querySelectorAll('.compare-check-btn.added').forEach(b => {
    b.classList.remove('added');
    b.innerHTML = '<i class="fas fa-exchange-alt"></i> Compare';
  });
  updateCompareBar();
};

// ---- LOYALTY POINTS ----
function getLoyaltyPoints() { return parseInt(localStorage.getItem('sn-points') || '0'); }
function addLoyaltyPoints(pts) {
  const current = getLoyaltyPoints();
  localStorage.setItem('sn-points', current + pts);
  updateDashboardPoints();
}
function showLoyaltyToast(pts) {
  const toast = document.getElementById('loyaltyToast');
  const ptsEl = document.getElementById('toastPoints');
  if (!toast) return;
  if (ptsEl) ptsEl.textContent = pts;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3500);
}
function updateDashboardPoints() {
  const pts = getLoyaltyPoints();
  const el = document.querySelector('.loyalty-points-display');
  if (el) el.textContent = pts.toLocaleString('en-IN');
  const fill = document.querySelector('.progress-bar-fill');
  if (fill) fill.style.width = Math.min((pts / 5000) * 100, 100) + '%';
}
document.addEventListener('DOMContentLoaded', updateDashboardPoints);

// ---- SAVE BOOKING TO DASHBOARD ----
function saveDashboardBooking(form) {
  const bookings = JSON.parse(localStorage.getItem('sn-bookings') || '[]');
  const nameInput = form.querySelector('input[type="text"]');
  const dateInput = form.querySelector('input[type="date"]');
  const roomSel = form.querySelector('#roomType') || form.querySelector('select');
  bookings.unshift({
    type: 'Room',
    hotel: document.getElementById('hotelSelect')?.value || 'StayNamasté Hotel',
    room: roomSel?.value || 'Deluxe Room',
    date: dateInput?.value || new Date().toISOString().split('T')[0],
    status: 'confirmed',
    id: 'SN' + Date.now()
  });
  localStorage.setItem('sn-bookings', JSON.stringify(bookings.slice(0, 10)));
}

// ---- DASHBOARD RENDER ----
function renderDashboard() {
  const bookings = JSON.parse(localStorage.getItem('sn-bookings') || '[]');
  const el = document.getElementById('dashBookings');
  if (!el) return;
  if (bookings.length === 0) {
    el.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem">No bookings yet. <a href="room_booking.html" style="color:var(--teal)">Book your first room!</a></p>';
    return;
  }
  el.innerHTML = bookings.map(b => `
    <div class="booking-item">
      <div>
        <div class="booking-item-name">${b.hotel}</div>
        <div class="booking-item-date">${b.room} · ${b.date} · #${b.id}</div>
      </div>
      <span class="booking-status status-${b.status}">${b.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}</span>
    </div>`).join('');
  updateDashboardPoints();
}
document.addEventListener('DOMContentLoaded', renderDashboard);

// ---- REVIEW SYSTEM ----
let currentRating = 0;
window.setRating = function(r) {
  currentRating = r;
  document.querySelectorAll('.star-picker span').forEach((s, i) => {
    s.classList.toggle('active', i < r);
  });
};
window.submitReview = function() {
  const text = document.getElementById('reviewText');
  const success = document.getElementById('reviewSuccess');
  if (!text || !currentRating) { alert('Please select a star rating first!'); return; }
  if (text.value.trim().length < 10) { alert('Please write at least 10 characters in your review.'); return; }
  if (success) success.style.display = 'block';
  text.value = '';
  currentRating = 0;
  document.querySelectorAll('.star-picker span').forEach(s => s.classList.remove('active'));
  setTimeout(() => { if (success) success.style.display = 'none'; }, 4000);
  addLoyaltyPoints(50);
  showLoyaltyToast(50);
};

// ---- CHATBOT ----
const chatResponses = {
  'book': 'Sure! To book a room, visit our <a href="room_booking.html" style="color:var(--gold-light)">Room Booking page</a>. We have 5 room types from ₹2,999/night!',
  'room': 'We offer Deluxe (₹4,999), Suite (₹7,999), Executive (₹6,499), Family (₹5,999), and Presidential Suite (₹14,999) rooms. Which one interests you?',
  'food': 'Check out our <a href="food_order.html" style="color:var(--gold-light)">Food Order page</a>! We have Biryani, Pizza, Butter Chicken, Thali, Desserts and more. Delivery in 30-45 mins!',
  'table': 'Reserve your table at our <a href="table_booking.html" style="color:var(--gold-light)">Table Booking page</a>. We have Royal Corner, Sunset View, Rooftop Garden and more!',
  'points': `You have <strong>${getLoyaltyPoints().toLocaleString('en-IN')} loyalty points</strong>! Earn points on every booking. 5000 points = ₹500 off your next stay! 🏆`,
  'cancel': 'Free cancellation is available up to 24 hours before check-in for rooms, and 2 hours before for table reservations. No questions asked! ✅',
  'city': 'We have hotels in 6 Indian metro cities: Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Kolkata! Each city has 2-3 premium properties.',
  'offer': 'Current offers: STAY20 (20% off), EARLY30 (30% early bird), BUNDLE25 (25% bundle). Use codes on the booking page! 🎟️',
  'promo': 'Active promo codes: STAY20, FIRST50, EARLY30, DINE15, BUNDLE25, SUSHANT10. Enter on booking or food order pages!',
  'check': 'Standard check-in is 2:00 PM and check-out is 12:00 PM (noon). Early check-in or late check-out can be requested as a special request!',
  'wifi': 'All our hotels offer complimentary high-speed WiFi. Silicon Valley Suites in Bangalore even has a dedicated co-working lounge! 📶',
  'spa': 'Spa facilities are available at The Sea Palace (Mumbai), Garden City Inn (Bangalore), and Nizam\'s Palace (Hyderabad). Book in advance!',
  'hello': 'Namaste! 🙏 Welcome to StayNamasté! How can I help you today? You can ask me about rooms, food, table booking, offers, and more!',
  'hi': 'Hi there! 👋 I\'m NamasBot. Ask me about rooms, dining, offers, loyalty points, or anything about StayNamasté!',
  'default': 'I\'m here to help! 😊 You can ask me about: <strong>rooms, food, table booking, loyalty points, promo codes, cancellation, check-in times, cities, or offers.</strong>'
};
window.toggleChatbot = function() {
  document.getElementById('chatbotWindow')?.classList.toggle('open');
};
window.quickChat = function(msg) {
  document.getElementById('chatInput').value = msg;
  sendChat();
};
window.sendChat = function() {
  const input = document.getElementById('chatInput');
  const msgs  = document.getElementById('chatMessages');
  if (!input || !msgs) return;
  const text = input.value.trim();
  if (!text) return;
  msgs.innerHTML += `<div class="chat-msg user">${text}</div>`;
  input.value = '';
  const lower = text.toLowerCase();
  let reply = chatResponses.default;
  for (const [key, val] of Object.entries(chatResponses)) {
    if (lower.includes(key)) { reply = val; break; }
  }
  setTimeout(() => {
    msgs.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 500);
  msgs.scrollTop = msgs.scrollHeight;
};

// ---- FOOD CART ----
let cart = [];
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  if (!cartItems) return;
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">🛒 Your cart is empty</div>';
  } else {
    cartItems.innerHTML = cart.map((item, i) =>
      `<div class="cart-item">
        <span class="cart-item-name">${item.name}</span>
        <span style="display:flex;align-items:center;gap:0.5rem">
          <span class="cart-item-price">₹${item.price}</span>
          <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
        </span>
      </div>`).join('');
  }
  const total = cart.reduce((s, i) => s + i.price, 0);
  if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
  if (cartCount) cartCount.textContent = cart.length;
}
window.addToCart = function(name, price) {
  cart.push({ name, price });
  renderCart();
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.background = '#2ecc71';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1200);
};
window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  renderCart();
};
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert('Please add items to your cart first!'); return; }
    const total = cart.reduce((s, i) => s + i.price, 0);
    const pts = Math.floor(total / 10);
    addLoyaltyPoints(pts);
    showLoyaltyToast(pts);
    alert(`🎉 Order Placed!\n\nTotal: ₹${total.toLocaleString('en-IN')}\nYou earned ${pts} loyalty points!\n\nYour food will be ready in 30–45 minutes. 🍛`);
    cart = [];
    renderCart();
  });
}

// ---- FOOD MENU FILTER ----
window.filterMenu = function(cat, btn) {
  document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.menu-category').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
};

// ---- DIETARY FILTER ----
window.filterDiet = function(type) {
  document.querySelectorAll('.menu-item-card').forEach(card => {
    const tag = card.querySelector('.diet-tag');
    if (!tag || type === 'all') { card.style.display = ''; return; }
    card.style.display = tag.classList.contains('diet-' + type) ? '' : 'none';
  });
  document.querySelectorAll('.diet-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.diet === type));
};

// ---- CHEF'S SPECIAL COUNTDOWN ----
function updateChefsTimer() {
  const el = document.getElementById('chefsCountdown');
  if (!el) return;
  const now = new Date();
  const midnight = new Date(); midnight.setHours(23, 59, 59, 0);
  const diff = midnight - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateChefsTimer, 1000);
updateChefsTimer();

// ---- MULTI-LANGUAGE ----
const translations = {
  en: { tagline:'Discover India\'s Finest', heroSub:'Handpicked hotels in Mumbai, Delhi, Bangalore, Hyderabad, Chennai & Kolkata — rooms, dining, and experiences worth remembering.', exploreHotels:'Explore Hotels', bookRoom:'Book a Room' },
  hi: { tagline:'भारत का सर्वश्रेष्ठ अनुभव करें', heroSub:'मुंबई, दिल्ली, बेंगलुरु, हैदराबाद, चेन्नई और कोलकाता में चुनिंदा होटल — कमरे, भोजन और यादगार अनुभव।', exploreHotels:'होटल देखें', bookRoom:'कमरा बुक करें' },
  ta: { tagline:'இந்தியாவின் சிறந்ததை கண்டறியுங்கள்', heroSub:'மும்பை, டெல்லி, பெங்களூரு, ஹைதராபாத், சென்னை மற்றும் கொல்கத்தாவில் தேர்ந்தெடுக்கப்பட்ட ஹோட்டல்கள்.', exploreHotels:'ஹோட்டல்களை காண்க', bookRoom:'அறையை முன்பதிவு செய்க' },
  te: { tagline:'భారతదేశంలో అత్యుత్తమాన్ని కనుగొనండి', heroSub:'ముంబై, ఢిల్లీ, బెంగళూరు, హైదరాబాద్, చెన్నై & కోల్‌కతాలో ఎంపిక చేయబడిన హోటళ్ళు.', exploreHotels:'హోటళ్ళు చూడండి', bookRoom:'గది బుక్ చేయండి' },
  bn: { tagline:'ভারতের সেরাটি আবিষ্কার করুন', heroSub:'মুম্বাই, দিল্লি, বেঙ্গালুরু, হায়দরাবাদ, চেন্নাই এবং কলকাতায় বাছাই করা হোটেল।', exploreHotels:'হোটেল দেখুন', bookRoom:'রুম বুক করুন' }
};
window.changeLanguage = function(lang) {
  const t = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  localStorage.setItem('sn-lang', lang);
};
const langSelect = document.getElementById('langSelect');
const savedLang = localStorage.getItem('sn-lang') || 'en';
if (langSelect) { langSelect.value = savedLang; changeLanguage(savedLang); }

// ---- REFERRAL CODE COPY ----
window.copyReferral = function() {
  const code = document.getElementById('refCode')?.textContent;
  if (code) {
    navigator.clipboard.writeText(code).then(() => alert(`✅ Referral code "${code}" copied! Share with friends to earn ₹200 off.`));
  }
};

// ---- PASS SEARCH DATA ----
window.passSearchData = function() {
  const city = document.getElementById('searchCity')?.value;
  const ci   = document.getElementById('searchCheckin')?.value;
  const co   = document.getElementById('searchCheckout')?.value;
  if (city) sessionStorage.setItem('searchCity', city);
  if (ci)   sessionStorage.setItem('searchCheckin', ci);
  if (co)   sessionStorage.setItem('searchCheckout', co);
};

// ---- TABLE BOOKING SUBMIT ----
const tableBookingForm = document.getElementById('tableBookingForm');
if (tableBookingForm) {
  tableBookingForm.addEventListener('submit', e => {
    e.preventDefault();
    addLoyaltyPoints(30);
    showLoyaltyToast(30);
    const card = document.getElementById('tableFormCard');
    const confirm = document.getElementById('tableConfirm');
    if (card) card.style.display = 'none';
    if (confirm) confirm.style.display = 'block';
  });
}

// ---- AUTH FORMS ----
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('sn-logged-in', 'true');
    alert('🎉 Welcome back to StayNamasté!\n\nYou have been signed in successfully.');
    setTimeout(() => window.location.href = 'index.html', 600);
  });
}
const regForm = document.getElementById('regForm');
if (regForm) {
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('sn-logged-in', 'true');
    addLoyaltyPoints(200);
    alert('🎉 Welcome to StayNamasté!\n\nYour account is created + 200 welcome loyalty points added!\nYour ₹500 welcome credit is ready.');
    setTimeout(() => window.location.href = 'index.html', 600);
  });
}

// ---- SET DATE MINIMUMS ----
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  ['checkin','checkout','resvDate','searchCheckin','searchCheckout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.min = today;
  });

  // Restore city from search
  const savedCity = sessionStorage.getItem('searchCity');
  const cityEl = document.getElementById('citySelect');
  if (savedCity && cityEl) cityEl.value = savedCity;

  renderCart();
});

// ---- HOTEL SELECT DROPDOWN (room booking) ----
const hotelsByCity = {
  'Mumbai':    ['The Sea Palace','Bandra Grand','Juhu Beach Resort'],
  'Delhi':     ['Imperial Haveli','Lutyens Residency','Delhi Crown Hotel'],
  'Bangalore': ['Silicon Valley Suites','Garden City Inn','MG Road Grand'],
  'Hyderabad': ["Nizam's Palace Hotel",'Cyber Pearl Inn','Pearl City Grand'],
  'Chennai':   ['Marina Bay Retreat','Chettinad Palace','Adyar Riverside'],
  'Kolkata':   ['Victoria Heritage','Howrah Grand','Salt Lake Suites'],
};
window.updateHotels = function() {
  const city = document.getElementById('citySelect')?.value;
  const sel  = document.getElementById('hotelSelect');
  if (!sel) return;
  sel.innerHTML = '';
  (hotelsByCity[city] || []).forEach(h => {
    const o = document.createElement('option'); o.value = h; o.textContent = h; sel.appendChild(o);
  });
  if (!hotelsByCity[city]) sel.innerHTML = '<option>— Choose city first —</option>';
};

// ---- RESTAURANT SELECT (table booking) ----
const restByCity = {
  'Mumbai':    ['The Sea Palace — Marina Restaurant','Bandra Grand — Bandra Bites','Juhu Beach Resort — Sunset Grill'],
  'Delhi':     ['Imperial Haveli — Mughal Kitchen','Lutyens Residency — The Garden Table','Delhi Crown — Royal Diner'],
  'Bangalore': ['Silicon Valley Suites — Farm & Fork','Garden City Inn — The Leaf Café','MG Road Grand — Canopy'],
  'Hyderabad': ["Nizam's Palace — Dum Khana","Cyber Pearl Inn — Pearl Grill","Pearl City Grand — Heritage Kitchen"],
  'Chennai':   ['Marina Bay Retreat — Coastal Table','Chettinad Palace — Spice Route','Adyar Riverside — River View Bistro'],
  'Kolkata':   ['Victoria Heritage — Adda Diner','Howrah Grand — Riverside Table','Salt Lake Suites — The Bong Feast'],
};
window.updateRestaurants = function() {
  const city = document.getElementById('citySelectTable')?.value;
  const sel  = document.getElementById('restSelect');
  if (!sel) return;
  sel.innerHTML = '';
  (restByCity[city] || []).forEach(r => {
    const o = document.createElement('option'); o.value = r; o.textContent = r; sel.appendChild(o);
  });
  if (!restByCity[city]) sel.innerHTML = '<option>— Choose city first —</option>';
};

// ---- TABLE SELECT ----
window.selectTable = function(el, name, guests, price) {
  document.querySelectorAll('.room-select-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const disp = document.getElementById('tableTypeDisplay');
  const summ = document.getElementById('tableTypeSummary');
  const chrg = document.getElementById('coverCharge');
  if (disp) disp.value = name;
  if (summ) summ.textContent = name;
  if (chrg) chrg.textContent = '₹' + price.toLocaleString('en-IN');
};

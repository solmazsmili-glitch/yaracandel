'use strict';

/* ---------- ابزارها ---------- */
const $ = id => document.getElementById(id);
const fa = n => Number(n).toLocaleString('fa-IR');

const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

function o(id, html) {
  const el = $(id);
  if (el) el.innerHTML = html;
}

const normPhone = v => String(v)
  .trim()
  .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const validPhone = v => /^09\d{9}$/.test(normPhone(v));

/* ---------- اطلاعات محصولات ---------- */
const COLORS = [
  ['نود', '#E6D2BE'],
  ['کرم', '#F3E8D6'],
  ['سبز مریمی', '#A8B89B'],
  ['سبز زیتونی', '#8A9A6E'],
  ['صورتی نود', '#E3C4B8'],
  ['کاپوچینو', '#B99A82'],
  ['شکلاتی', '#7A5C48'],
  ['سفید', '#FAF7F2']
];

const SHAPES = {
  jar: ['شمع شیشه‌ای', 0],
  pillar: ['استوانه‌ای', 40000],
  bowl: ['کاسه‌ای', 60000]
};

const SIZES = {
  S: ['کوچک', 180000],
  M: ['متوسط', 290000],
  L: ['بزرگ', 420000]
};

const SCENTS = [
  'وانیل و عنبر',
  'اکالیپتوس و نعنا',
  'گل رز',
  'چوب صندل',
  'لاوندر',
  'بدون رایحه'
];

const P = [
  ['نود وانیل', 'jar', 1, 'M', 'وانیل و عنبر'],
  ['سبز مریمی', 'jar', 2, 'M', 'اکالیپتوس و نعنا'],
  ['استوانه کرم', 'pillar', 1, 'S', 'چوب صندل'],
  ['کاسه رز', 'bowl', 4, 'M', 'گل رز'],
  ['کاپوچینو', 'jar', 5, 'L', 'وانیل و عنبر'],
  ['زیتونی لاوندر', 'pillar', 3, 'M', 'لاوندر']
].map((p, i) => ({
  id: i,
  name: p[0],
  shape: p[1],
  color: COLORS[p[2]],
  size: p[3],
  scent: p[4],
  price: SIZES[p[3]][1] + SHAPES[p[1]][1]
}));

/* ---------- تصویر شمع ---------- */
function candle(c, s, w = 120) {
  let b = '';

  if (s === 'pillar') {
    b = `
      <rect x="38" y="46" width="44" height="86"
        rx="6" fill="${esc(c)}"/>
      <rect x="38" y="46" width="12" height="86"
        rx="6" fill="#fff" opacity=".18"/>
    `;
  } else if (s === 'bowl') {
    b = `
      <path d="M16 92h88l-10 36a10 10 0 0 1-10 7H36a10 10 0 0 1-10-7z"
        fill="#CDBBA6"/>
      <ellipse cx="60" cy="92" rx="44" ry="8"
        fill="${esc(c)}"/>
    `;
  } else {
    b = `
      <rect x="26" y="58" width="68" height="74"
        rx="12" fill="#D8CBBB" opacity=".7"/>
      <rect x="31" y="66" width="58" height="62"
        rx="9" fill="${esc(c)}"/>
      <rect x="26" y="52" width="68" height="10"
        rx="4" fill="#8A7B68"/>
    `;
  }

  const wy = s === 'pillar' ? 46 : s === 'bowl' ? 92 : 66;

  return `
    <svg width="${w}" height="${w * 1.25}"
      viewBox="0 0 120 150" aria-hidden="true">
      ${b}
      <rect x="59" y="${wy - 10}" width="2" height="10"
        fill="#4a3f33"/>
      <path d="M60 ${wy - 34}c8 10 8 18 0 24c-8-6-8-14 0-24z"
        fill="#F4B860"/>
      <path d="M60 ${wy - 26}c4 5 4 9 0 12c-4-3-4-7 0-12z"
        fill="#FFE9A8"/>
    </svg>
  `;
}

/* ---------- نمایش فروشگاه ---------- */
o('grid', P.map(p => `
  <div class="card">
    <div class="img">${candle(p.color[1], p.shape, 90)}</div>
    <div class="b">
      <b>${esc(p.name)}</b>
      <span style="font-size:12px;color:var(--mut)">
        ${esc(p.scent)} · ${SIZES[p.size][0]}
      </span>
      <span class="price">${fa(p.price)} تومان</span>
      <button class="btn" onclick="addP(${p.id})">
        افزودن به سبد
      </button>
    </div>
  </div>
`).join(''));

o('heroC', candle('#FAF7F2', 'jar', 200));
o('stC', candle('#F3E8D6', 'jar', 150));

/* ---------- سفارش اختصاصی ---------- */
let st = {
  shape: 'jar',
  size: 'M',
  color: COLORS[0]
};

function cprice() {
  return SIZES[st.size][1] + SHAPES[st.shape][1];
}

function rb() {
  o('o-shape', Object.entries(SHAPES).map(([k, v]) => `
    <button class="opt ${st.shape === k ? 'on' : ''}"
      onclick="st.shape='${k}';rb()">
      ${v[0]}
    </button>
  `).join(''));

  o('o-size', Object.entries(SIZES).map(([k, v]) => `
    <button class="opt ${st.size === k ? 'on' : ''}"
      onclick="st.size='${k}';rb()">
      ${v[0]}
    </button>
  `).join(''));

  o('o-color', COLORS.map((c, i) => `
    <button class="sw ${st.color[1] === c[1] ? 'on' : ''}"
      style="background:${c[1]}"
      title="${c[0]}"
      aria-label="${c[0]}"
      onclick="st.color=COLORS[${i}];rb()">
    </button>
  `).join('') + `
    <input type="color" id="customColor"
      value="${esc(st.color[1])}"
      style="width:40px;height:34px;padding:2px"
      oninput="st.color=['رنگ دلخواه',this.value];rp()"
      title="رنگ دلخواه" aria-label="رنگ دلخواه">
  `);

  rp();
}

function rp() {
  o('pv', candle(st.color[1], st.shape, 170));
  o('pvt', `
    ${SHAPES[st.shape][0]} ·
    ${SIZES[st.size][0]} ·
    ${esc(st.color[0])}
  `);
  o('cp', fa(cprice()) + ' تومان');
}

o('scent', SCENTS.map(s =>
  `<option value="${esc(s)}">${esc(s)}</option>`
).join(''));

/* ---------- سبد خرید ---------- */
let cart = [];

try {
  const saved = JSON.parse(localStorage.getItem('cart') || '[]');

  if (Array.isArray(saved)) {
    cart = saved.filter(i =>
      i &&
      typeof i.name === 'string' &&
      typeof i.note === 'string' &&
      typeof i.color === 'string' &&
      Object.prototype.hasOwnProperty.call(SHAPES, i.shape) &&
      Number.isFinite(Number(i.price)) &&
      Number(i.price) > 0 &&
      Number.isInteger(Number(i.qty)) &&
      Number(i.qty) > 0
    ).map(i => ({
      ...i,
      price: Number(i.price),
      qty: Number(i.qty)
    }));
  }
} catch (e) {
  cart = [];
}

function save() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.error('خطا در ذخیره سبد خرید:', e);
  }

  rc();
}

function addP(i) {
  const p = P[i];
  if (!p) return;

  push({
    name: p.name,
    color: p.color[1],
    shape: p.shape,
    price: p.price,
    qty: 1,
    note: p.scent
  });
}

function addCustom() {
  const note = $('note')?.value.trim().slice(0, 200) || '';
  const scent = $('scent')?.value || SCENTS[0];

  push({
    name: 'شمع اختصاصی',
    color: st.color[1],
    shape: st.shape,
    price: cprice(),
    qty: 1,
    note: [
      SHAPES[st.shape][0],
      SIZES[st.size][0],
      st.color[0],
      scent,
      note
    ].filter(Boolean).join('، ')
  });
}

function push(it) {
  if (
    !it ||
    !it.name ||
    !it.note ||
    !Object.prototype.hasOwnProperty.call(SHAPES, it.shape) ||
    !Number.isFinite(it.price) ||
    it.price <= 0 ||
    !Number.isInteger(it.qty) ||
    it.qty < 1
  ) {
    console.error('اطلاعات محصول نامعتبر است:', it);
    return;
  }

  const existing = cart.find(c =>
    c.name === it.name &&
    c.note === it.note &&
    c.color === it.color &&
    c.shape === it.shape &&
    c.price === it.price
  );

  if (existing) {
    existing.qty += it.qty;
  } else {
    cart.push(it);
  }

  save();
  openCart();
}

function total() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function qty(i, d) {
  if (!cart[i]) return;

  cart[i].qty += d;

  if (cart[i].qty < 1) {
    cart.splice(i, 1);
  }

  save();
}

function rc() {
  const count = fa(cart.reduce((sum, c) => sum + c.qty, 0));

  o('cc', count);
  o('cc2', count);

  o('items', cart.length ? cart.map((c, i) => `
    <div class="it">
      ${candle(c.color, c.shape, 36)}
      <div class="t">
        <b>${esc(c.name)}</b><br>
        <span style="color:var(--mut)">${esc(c.note)}</span><br>
        <span class="price">${fa(c.price * c.qty)} تومان</span>
      </div>
      <div>
        <button class="opt" onclick="qty(${i},1)"
          aria-label="افزودن">+</button>
        ${fa(c.qty)}
        <button class="opt" onclick="qty(${i},-1)"
          aria-label="کم کردن">−</button>
      </div>
    </div>
  `).join('') : `
    <p style="color:var(--mut);text-align:center">
      سبد خرید خالی است
    </p>
  `);

  o('sum', fa(total()) + ' تومان');
  o('ptot', fa(total()) + ' تومان');
}

/* ---------- پنجره‌ها ---------- */
function closeAll() {
  document.querySelectorAll('.ov').forEach(el =>
    el.classList.remove('show')
  );
}

function openCart() {
  closeAll();
  $('cartOv')?.classList.add('show');
}

function openSide() {
  closeAll();
  $('sideOv')?.classList.add('show');
}

function openCheckout() {
  if (!cart.length) return;

  closeAll();
  $('coOv')?.classList.add('show');
}

function openSearch() {
  closeAll();

  const overlay = $('searchOv');
  const input = $('sq');

  if (!overlay || !input) return;

  overlay.classList.add('show');
  input.value = '';
  doSearch();
  input.focus();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAll();
});

/* ---------- جستجو ---------- */
function doSearch() {
  const q = $('sq')?.value.trim() || '';

  const results = P.filter(p =>
    !q || [
      p.name,
      p.scent,
      SHAPES[p.shape][0],
      p.color[0]
    ].some(s => s.includes(q))
  );

  o('sr', results.length ? results.map(p => `
    <div class="it">
      ${candle(p.color[1], p.shape, 36)}
      <div class="t">
        <b>${esc(p.name)}</b><br>
        <span style="color:var(--mut)">
          ${esc(p.scent)} · ${SIZES[p.size][0]}
        </span><br>
        <span class="price">${fa(p.price)} تومان</span>
      </div>
      <button class="opt" onclick="addP(${p.id})">
        افزودن
      </button>
    </div>
  `).join('') : `
    <p style="text-align:center;color:var(--mut)">
      چیزی پیدا نشد؛ می‌تونی شمع دلخواهت را سفارش بدی.
    </p>
    <a class="btn" href="#custom"
      style="display:block;text-align:center">
      سفارش اختصاصی
    </a>
  `);
}

/* ---------- صفحه‌ها ---------- */
function go() {
  const h = (location.hash || '#home').slice(1);

  const pages = {
    home: 'home',
    shop: 'shop',
    custom: 'shop',
    about: 'about',
    contact: 'about',
    login: 'login'
  };

  document.body.dataset.pg = pages[h] || 'home';
  closeAll();

  document.querySelectorAll('.nav a.h').forEach(a => {
    a.classList.toggle(
      'on',
      a.getAttribute('href') ===
      '#' + (h === 'contact' ? 'about' : h)
    );
  });

  const el = ['custom', 'contact'].includes(h) ? $(h) : null;

  if (el) {
    el.scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }
}

document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');

  if (!a || a.getAttribute('href').length <= 1) return;

  e.preventDefault();

  const hash = a.getAttribute('href');

  if (location.hash === hash) {
    go();
  } else {
    location.hash = hash.slice(1);
  }
});

window.addEventListener('hashchange', go);

/* ---------- تماس ---------- */
function sendMsg() {
  const name = $('cn')?.value.trim() || '';
  const message = $('cm')?.value.trim() || '';

  if (!name || !message) {
    alert('لطفاً نام و پیام را وارد کنید.');
    return;
  }

  o('cf', `
    <div style="text-align:center;padding:40px 0">
      <div style="font-size:42px">🌿</div>
      <b>پیامت رسید!</b><br>
      به‌زودی باهات تماس می‌گیریم.
    </div>
  `);
}

/* ---------- ورود و ثبت‌نام نمایشی ---------- */
let lm = 1;

function lt(n) {
  lm = n;

  $('l1')?.classList.toggle('on', n === 1);
  $('l2')?.classList.toggle('on', n === 2);

  if ($('lname')) {
    $('lname').style.display = n === 2 ? 'block' : 'none';
  }

  if ($('lbtn')) {
    $('lbtn').textContent = n === 1 ? 'ورود' : 'ثبت‌نام';
  }
}

function doLogin() {
  const phone = $('lph')?.value || '';
  const password = $('lpw')?.value || '';

  if (!validPhone(phone) || password.length < 6) {
    alert('شماره موبایل معتبر و رمز حداقل ۶ کاراکتر وارد کنید.');
    return;
  }

  o('lbox', `
    <div style="text-align:center;padding:24px 0">
      <div style="font-size:42px">🌿</div>
      <h3>${lm === 1 ? 'خوش آمدی!' : 'ثبت‌نام انجام شد'}</h3>
      <p style="color:var(--mut)">(نسخه نمایشی)</p>
      <a class="btn" href="#shop">رفتن به فروشگاه</a>
    </div>
  `);
}

/* ---------- پرداخت نمایشی ---------- */
let pmv = 1;

function pm(n) {
  pmv = n;

  $('p1')?.classList.toggle('on', n === 1);
  $('p2')?.classList.toggle('on', n === 2);
}

function pay() {
  const name = $('nm')?.value.trim() || '';
  const phone = $('ph')?.value || '';
  const address = $('ad')?.value.trim() || '';

  if (!cart.length) {
    alert('سبد خرید شما خالی است.');
    return;
  }

  if (!name || !validPhone(phone) || !address) {
    alert('لطفاً نام، شماره موبایل معتبر و آدرس را وارد کنید.');
    return;
  }

  const code = 'LC-' +
    Math.floor(10000 + Math.random() * 90000);

  o('coBox', `
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:46px">🌿</div>
      <h3>سفارش شما ثبت شد</h3>
      <p style="color:var(--mut)">
        کد پیگیری: <b>${code}</b><br>
        مبلغ سفارش: ${fa(total())} تومان<br>
        ${
          pmv === 1
            ? 'نسخه نمایشی؛ پرداخت بانکی واقعی انجام نشده است.'
            : 'پرداخت هنگام تحویل انتخاب شد.'
        }
      </p>
      <button class="btn" onclick="finishOrder()">
        بازگشت به فروشگاه
      </button>
    </div>
  `);
}

function finishOrder() {
  cart = [];
  save();
  closeAll();
  location.hash = 'home';
  go();
}

/* ---------- شروع برنامه ---------- */
rb();
rc();
go();
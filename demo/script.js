const state = {
  cart: JSON.parse(localStorage.getItem('rhCart') || '[]'),
  previousBooking: JSON.parse(localStorage.getItem('rhPreviousBooking') || 'null'),
};

const trips = [
  {
    id: 'trip-1',
    title: 'رحلة تسلق جبلية في ظفار',
    supplier: 'مغامرات ظفار',
    price: 135,
    remaining: 3,
    summary: 'رحلة 3 أيام مع دليل معتمد ومسار يومي واضح.',
  },
  {
    id: 'trip-2',
    title: 'غوص ساحل مسقط',
    supplier: 'بحّار للمغامرات',
    price: 120,
    remaining: 5,
    summary: 'باقة غوص شامل معدات السلامة ودعم الغواصين.',
  },
  {
    id: 'trip-3',
    title: 'تخييم صحرائي مع أفطار وجولات',
    supplier: 'رحلات الرمال',
    price: 99,
    remaining: 2,
    summary: 'ليلة في الخيمة مع مركبة 4x4 ونظام أكل جاهز.',
  },
];

const items = [
  {
    id: 'gear-1',
    title: 'حبل تسلق معتمد',
    category: 'معدات السلامة',
    price: 18,
    details: 'شهادة فحص رقمية ومدى ضمان 6 أشهر.',
  },
  {
    id: 'rental-1',
    title: 'جيب صحراوي 4x4',
    category: 'مركبات',
    price: 65,
    details: 'التأمين قابل للاسترداد، التوثيق بالصور فيديو.',
  },
];

function getRealPhotoUrl(category, index) {
  const queryMap = {
    gear: 'camping,climbing,diving,backpack,outdoor-gear',
    vehicle: 'jeep,atv,bike,boat,van,scooter,jet-ski',
    food: 'camping-food,bbq,meal,outdoor-dining,food-box',
  };
  const query = queryMap[category] || 'travel';
  return `https://source.unsplash.com/featured/640x480/?${encodeURIComponent(query)}&sig=${index}`;
}

const gearImageMap = {
  1: getRealPhotoUrl('gear', 1),
  2: getRealPhotoUrl('gear', 2),
  3: getRealPhotoUrl('gear', 3),
};

const gearTitleMap = {
  1: 'عدة غوص متكاملة',
  2: 'عدة تخييم شاملة',
  3: 'عدة تسلق أمان',
};

const gearCategoryMap = ['غوص', 'تخييم', 'تسلق', 'مشي', 'طبخ', 'صيد'];

const gearItems = Array.from({ length: 50 }, (_, index) => {
  const num = index + 1;
  const category = gearCategoryMap[num % gearCategoryMap.length];
  return {
    id: `gear-${num}`,
    category,
    title: gearTitleMap[num] || `عدة ${category}`,
    image: gearImageMap[num] || getRealPhotoUrl('gear', (num % 3) + 1),
    description: gearTitleMap[num] 
      ? `المعدات اللازمة لمغامرة آمنة ومريحة لـ ${gearTitleMap[num]} مجموعة` 
      : `عدة ${category} للرحلات والنزهات، مع فحص سلامة وتغليف مناسب`,
    price: 15 + (num % 12) * 6,
    details: `مواصفات: معدات ${category} مع ضمان دعم كامل المشاوير والنزهات`
  };
});
    

const rentalVehicleTypes = ['جيب صحراوي', 'دفع رباعي صغيرة', 'شاحنة نقل', 'تانك مروحية', 'دراجة جبلية', 'جسكي', 'كاياك', 'قارب تجديف', 'فان كرافان', 'سكوتر كهربائي'];

const rentalVehicles = Array.from({ length: 50 }, (_, index) => {
  const num = index + 1;
  const type = rentalVehicleTypes[num % rentalVehicleTypes.length];
  const basePrice = 35 + (num % 10) * 7;
  return {
    id: `vehicle-${num}`,
    title: `${type} رقم ${num}`,
    image: getRealPhotoUrl('vehicle', num),
    description: `مركبة ${type} تناسب ${type === 'دراجة جبلية' ? 'مسارات الجبال' : type === 'جسكي' ? 'الشواطئ والبحيرات' : type === 'كاياك' ? 'النهر والمسطحات المائية' : 'الطرق البرية'} لجميع الأنشطة.`,
    price: basePrice,
    seats: type.includes('دراجة') || type.includes('كاياك') ? 1 : 4 + (num % 4),
    fuel: type === 'كاياك' || type === 'قارب تجديف' ? 'بدون وقود' : ['بنزين', 'ديزل', 'هجين', 'كهرباء'][num % 4],
    activityType: type,
  };
});

const foodImageMap = {
  1: getRealPhotoUrl('food', 1),
  2: getRealPhotoUrl('food', 2),
};

const foodTitleMap = {
  1: 'لحم مُجهّز ومغلف',
  2: 'بوفيه مخيم كامل',
};

const foodOffers = Array.from({ length: 50 }, (_, index) => {
  const num = index + 1;
  const cuisine = ['مخيم', 'بوفيه', 'ساندويتش', 'صينية', 'سلطة'][num % 5];
  return {
    id: `food-${num}`,
    title: foodTitleMap[num] || `عرض ${cuisine} ${num}`,
    image: foodImageMap[num] || `images/food-${num}.svg`,
    description: foodTitleMap[num]
      ? `${foodTitleMap[num]} جاهز للتقديم مع تعبئة آمنة ومكونات طازجة.`
      : `وجبة ${cuisine} مع مكونات طازجة ومناسبة للرحلات، تشمل توصيل وتغليف آمن.`,
    price: 8 + (num % 10) * 3,
    servings: 1 + (num % 6),
  };
});

const tripCards = document.getElementById('tripCards');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const resumeButton = document.getElementById('resumeButton');
const checkoutButton = document.getElementById('checkoutButton');
const quickRebook = document.getElementById('quickRebook');

function renderTrips() {
  tripCards.innerHTML = trips.map(trip => `
    <div class="trip-card">
      <div>
        <h3>${trip.title}</h3>
        <div class="trip-details">
          <div>المورد: ${trip.supplier}</div>
          <div>السعر من: ${trip.price} ر.ع</div>
          <div>أماكن متبقية: ${trip.remaining}</div>
        </div>
      </div>
      <button data-action="add-to-cart" data-id="${trip.id}">أضف إلى السلة</button>
    </div>
  `).join('');
}

function renderProductSection(containerId, list, type) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="section-meta">عرض ${list.length} عنصرًا في هذا القسم</div>
    ${list.map(item => `
      <article class="product-card">
        <div class="product-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="product-details">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="product-meta">
            ${type === 'gear' ? `<span>مواصفات: ${item.details}</span>` : ''}
            ${type === 'vehicle' ? `<span>مقاعد: ${item.seats}</span><span>وقود: ${item.fuel}</span>` : ''}
            ${type === 'food' ? `<span>حصص: ${item.servings}</span>` : ''}
          </div>
        </div>
        <div class="product-footer">
          <strong>${item.price} ر.ع</strong>
          <button class="secondary-btn" data-action="add-to-cart" data-id="${item.id}">أضف للسلة</button>
        </div>
      </article>
    `).join('')}
  `;
}

function renderDataSections() {
  renderProductSection('gearGrid', gearItems, 'gear');
  renderProductSection('rentalGrid', rentalVehicles, 'vehicle');
  renderProductSection('foodGrid', foodOffers, 'food');
}

function saveCart() {
  localStorage.setItem('rhCart', JSON.stringify(state.cart));
}

const adminStats = {
  sales: {
    today: 1660,
    week: 9840,
    month: 41200,
  },
  activeBookings: 18,
  pendingRequests: 9,
  urgentAlerts: [
    'نزاع تأمين مركبة قائم',
    'مورد وثيقته ستنتهي خلال 30 يومًا',
    'حجز بدون توفر فعلي في سلة العميل',
  ],
  topItems: [
    'رحلة تسلق جبلية في ظفار',
    'وجبة مخيم العشاء الفاخر',
    'تأجير جيب صحراوي 4x4',
    'حبل تسلق معتمد',
    'باقة غوص ساحل مسقط',
  ],
};

const adminData = {
  suppliers: [
    { name: 'مغامرات ظفار', status: 'نشط', licenseExpiry: '2026-08-12', insuranceExpiry: '2026-09-01' },
    { name: 'مارين رنتال', status: 'قيد المراجعة', licenseExpiry: '2025-12-10', insuranceExpiry: '2026-01-15' },
    { name: 'طاسة للأكل', status: 'موقوف', licenseExpiry: '2025-10-20', insuranceExpiry: '2025-11-30' },
  ],
  bookings: [
    { id: 'B-1001', type: 'رحلة', customer: 'سالم', supplier: 'مغامرات ظفار', amount: '135 ر.ع', status: 'قادم', waiver: 'بانتظار' },
    { id: 'B-1002', type: 'تأجير', customer: 'منى', supplier: 'مارين رنتال', amount: '165 ر.ع', status: 'مؤكد', waiver: 'موقّع' },
    { id: 'B-1003', type: 'منتج', customer: 'ليلى', supplier: 'طاسة للأكل', amount: '8 ر.ع', status: 'مكتمل', waiver: 'غير مطلوب' },
  ],
  commissionRequests: [
    { id: 'C-5001', item: 'خيمة مستعملة', owner: 'خالد', status: 'قيد المراجعة', price: '80 ر.ع' },
    { id: 'C-5002', item: 'حبل تسلق قديم', owner: 'فيصل', status: 'قيد الفحص', price: '48 ر.ع' },
  ],
  contentItems: [
    { type: 'رحلة', title: 'رحلة تسلق جبلية', status: 'منشور' },
    { type: 'مركبة', title: 'جيب صحراوي 4x4', status: 'منشور' },
    { type: 'وجبة', title: 'وجبة مخيم العشاء', status: 'مسودة' },
  ],
  settlements: [
    { supplier: 'مغامرات ظفار', due: '1,240 ر.ع', date: '2026-07-12', status: 'معلّق' },
    { supplier: 'مارين رنتال', due: '820 ر.ع', date: '2026-07-10', status: 'مدفوع' },
  ],
  customers: [
    { name: 'سالم', spend: '420 ر.ع', bookings: 3, status: 'نشط' },
    { name: 'منى', spend: '265 ر.ع', bookings: 2, status: 'نشط' },
  ],
  supportTickets: [
    { id: 'T-9001', type: 'شكوى', booking: 'B-1002', status: 'جديدة' },
    { id: 'T-9002', type: 'استفسار عام', booking: '-', status: 'قيد المعالجة' },
  ],
};

function renderAdminActions() {
  const actionsEl = document.getElementById('adminActions');
  if (!actionsEl) return;

  const actions = [
    { title: 'إدارة الموردين', subtitle: 'مراجعة الموردين وتنبيهات الوثائق', action: 'open-admin-suppliers' },
    { title: 'إدارة الحجوزات', subtitle: 'عرض الحجوزات وحالتها، وإلغاء يدوي', action: 'open-admin-bookings' },
    { title: 'إدارة نظام العرض بالعمولة', subtitle: 'طلبات بيع الأدوات وتحديث الحالة', action: 'open-admin-commission' },
    { title: 'إدارة المحتوى', subtitle: 'تحرير الرحلات والمحتوى الثابت', action: 'open-admin-content' },
    { title: 'الإدارة المالية', subtitle: 'كشف تسويات، عمولات، واسترجاع تأمين', action: 'open-admin-finance' },
    { title: 'إدارة العملاء', subtitle: 'سجل العملاء والحسابات الموقوفة', action: 'open-admin-users' },
    { title: 'الشكاوى والدعم', subtitle: 'صندوق وارد وشكاوى مرتبطة بالحجوزات', action: 'open-admin-support' },
  ];

  actionsEl.innerHTML = actions.map(item => `
    <div class="admin-action-card" data-action="${item.action}">
      <h4>${item.title}</h4>
      <p>${item.subtitle}</p>
    </div>
  `).join('');
}

function renderTable(headers, rows) {
  return `
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;
}

function openAdminSection(action) {
  if (action === 'open-admin-suppliers') {
    openModal(`
      <h2>إدارة الموردين</h2>
      <p>قائمة الموردين، حالة المراجعة، وتنبيهات انتهاء الوثائق.</p>
      ${renderTable(
        ['المورد', 'الحالة', 'انتهاء الترخيص', 'انتهاء التأمين'],
        adminData.suppliers.map(item => [
          item.name,
          `<span class="status-badge">${item.status}</span>`,
          item.licenseExpiry,
          item.insuranceExpiry,
        ])
      )}
    `);
    return;
  }

  if (action === 'open-admin-bookings') {
    openModal(`
      <h2>إدارة الحجوزات</h2>
      <p>عرض موحّد لكل الحجوزات وحالة إقرار المخاطر.</p>
      ${renderTable(
        ['رقم الحجز', 'النوع', 'العميل', 'المورد', 'المبلغ', 'الحالة', 'إقرار المخاطر'],
        adminData.bookings.map(item => [item.id, item.type, item.customer, item.supplier, item.amount, item.status, item.waiver])
      )}
    `);
    return;
  }

  if (action === 'open-admin-commission') {
    openModal(`
      <h2>إدارة نظام العرض بالعمولة</h2>
      <p>طلبات بيع الأدوات وتحديث الحالة اليدوي.</p>
      ${renderTable(
        ['رقم الطلب', 'يعرض', 'صاحب الأداة', 'الحالة', 'السعر'],
        adminData.commissionRequests.map(item => [item.id, item.item, item.owner, `<span class="status-badge">${item.status}</span>`, item.price])
      )}
    `);
    return;
  }

  if (action === 'open-admin-content') {
    openModal(`
      <h2>إدارة المحتوى</h2>
      <p>تحرير الرحلات والمواد الثابتة مثل من نحن والشروط.</p>
      ${renderTable(
        ['النوع', 'العنوان', 'الحالة'],
        adminData.contentItems.map(item => [item.type, item.title, item.status])
      )}
    `);
    return;
  }

  if (action === 'open-admin-finance') {
    openModal(`
      <h2>الإدارة المالية والتسويات</h2>
      <p>كشوف المستحقات وحالة تحويل الموردين.</p>
      ${renderTable(
        ['المورد', 'المبلغ المستحق', 'تاريخ الاستحقاق', 'الحالة'],
        adminData.settlements.map(item => [item.supplier, item.due, item.date, `<span class="status-badge">${item.status}</span>`])
      )}
    `);
    return;
  }

  if (action === 'open-admin-users') {
    openModal(`
      <h2>إدارة المستخدمين</h2>
      <p>قائمة العملاء مع سجل الإنفاق والحالة.</p>
      ${renderTable(
        ['العميل', 'قيمة الإنفاق', 'عدد الحجوزات', 'الحالة'],
        adminData.customers.map(item => [item.name, item.spend, item.bookings, `<span class="status-badge">${item.status}</span>`])
      )}
    `);
    return;
  }

  if (action === 'open-admin-support') {
    openModal(`
      <h2>الشكاوى والدعم الفني</h2>
      <p>صندوق وارد مصنّف حسب النوع والحالة.</p>
      ${renderTable(
        ['رقم التذكرة', 'النوع', 'رقم الحجز', 'الحالة'],
        adminData.supportTickets.map(item => [item.id, item.type, item.booking, `<span class="status-badge">${item.status}</span>`])
      )}
    `);
    return;
  }
}

function renderAdminDashboard() {
  const metricsEl = document.getElementById('adminMetrics');
  const alertsEl = document.getElementById('urgentAlerts');
  const topItemsEl = document.getElementById('topItems');
  const salesChartEl = document.getElementById('salesChart');

  if (!metricsEl || !alertsEl || !topItemsEl || !salesChartEl) return;

  const healthStatus = adminStats.urgentAlerts.length > 0 ? 'تحذير' : 'جيدة';
  const healthText = adminStats.urgentAlerts.length > 0
    ? `هناك ${adminStats.urgentAlerts.length} تنبيهات عاجلة تتطلب المراجعة الفورية.`
    : 'لا توجد تنبيهات عاجلة في الوقت الحالي.';

  metricsEl.innerHTML = `
    <div class="dashboard-card">
      <h4>إجمالي المبيعات</h4>
      <p>اليوم: ${adminStats.sales.today} ر.ع</p>
      <p>الأسبوع: ${adminStats.sales.week} ر.ع</p>
      <p>الشهر: ${adminStats.sales.month} ر.ع</p>
    </div>
    <div class="dashboard-card">
      <h4>الحجوزات النشطة</h4>
      <p>${adminStats.activeBookings} حجزًا نشطًا الآن</p>
    </div>
    <div class="dashboard-card">
      <h4>الطلبات المعلّقة</h4>
      <p>${adminStats.pendingRequests} طلبًا يحتاجون تدخلك</p>
    </div>
    <div class="dashboard-card">
      <h4>مؤشر الصحة</h4>
      <p>الحالة العامة: ${healthStatus}</p>
      <p>${healthText}</p>
    </div>
  `;

  salesChartEl.innerHTML = `
    <div class="chart-bar chart-bar--today" style="height: ${Math.min(100, (adminStats.sales.today / adminStats.sales.month) * 100)}%;">${adminStats.sales.today}</div>
    <div class="chart-bar chart-bar--week" style="height: ${Math.min(100, (adminStats.sales.week / adminStats.sales.month) * 100)}%;">${adminStats.sales.week}</div>
    <div class="chart-bar chart-bar--month" style="height: 100%">${adminStats.sales.month}</div>
  `;

  alertsEl.innerHTML = adminStats.urgentAlerts.map(alert => `<li>${alert}</li>`).join('');
  topItemsEl.innerHTML = adminStats.topItems.map(item => `<li>${item}</li>`).join('');
  renderAdminActions();
}

function renderCart() {
  if (state.cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-item">السلة فارغة. أضف رحلة أو خدمة للبدء.</div>';
    cartTotalEl.textContent = '0 ر.ع';
    return;
  }

  cartItemsEl.innerHTML = state.cart.map((item, index) => `
    <div class="cart-item">
      <strong>${item.title}</strong>
      <div>${item.subtitle}</div>
      <div>السعر: ${item.price} ر.ع</div>
      <button data-action="remove-cart-item" data-index="${index}">إزالة</button>
    </div>
  `).join('');

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = `${total} ر.ع`;
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  saveCart();
  renderCart();
}

function openModal(contentHtml) {
  modalContent.innerHTML = contentHtml;
  modal.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
}

function closeModalDialog() {
  modal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
}

function addToCart(item) {
  state.cart.push(item);
  saveCart();
  renderCart();
}

function handleActions(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  if (target.tagName === 'A') {
    event.preventDefault();
  }
  let action = target.dataset.action;
  if (action === 'browse-ready') action = 'open-booking';
  if (action === 'build-your-trip') action = 'open-builder';

  if (action === 'add-to-cart') {
    const productId = target.dataset.id;
    const trip = trips.find(t => t.id === productId);
    const gear = gearItems.find(item => item.id === productId);
    const vehicle = rentalVehicles.find(item => item.id === productId);
    const food = foodOffers.find(item => item.id === productId);

    if (trip) {
      addToCart({
        title: trip.title,
        subtitle: `من المورد ${trip.supplier}`,
        price: trip.price,
      });
      return;
    }

    if (gear) {
      addToCart({
        title: gear.title,
        subtitle: gear.description,
        price: gear.price,
      });
      return;
    }

    if (vehicle) {
      addToCart({
        title: vehicle.title,
        subtitle: `${vehicle.fuel} - ${vehicle.seats} مقاعد`,
        price: vehicle.price,
      });
      return;
    }

    if (food) {
      addToCart({
        title: food.title,
        subtitle: `حصص: ${food.servings}`,
        price: food.price,
      });
      return;
    }

    return;
  }

  if (action === 'remove-cart-item') {
    removeCartItem(Number(target.dataset.index));
    return;
  }

  if (action.startsWith('open-admin-')) {
    openAdminSection(action);
    return;
  }

  if (action === 'open-booking') {
    openModal(`
      <h2>حجز رحلة جاهزة</h2>
      <p>اختر الرحلة مع إضافات مرنة لوجبات ومعدات. نحن نوفر المركبات، الأكل، والمعدات فقط.</p>
      <div class="note-box">يمكنك تعديل الحزمة قبل الدفع لتشمل أدوات ومأكولات إضافية.</div>
      <form id="bookingForm">
        <label>اختر الرحلة<select name="trip">
          ${trips.map(trip => `<option value="${trip.id}">${trip.title} — ${trip.price} ر.ع</option>`).join('')}
        </select></label>
        <label>التاريخ<input type="date" name="date" required></label>
        <label>عدد الأفراد<input type="number" name="people" min="1" value="2" required></label>
        <label>الإضافات المتاحة</label>
        <label><input type="checkbox" name="extras" value="meals|35"> وجبات إضافية (+35 ر.ع)</label>
        <label><input type="checkbox" name="extras" value="equipment|25"> معدات إضافية (+25 ر.ع)</label>
        <label>اسم جهة الطوارئ<input type="text" name="emergencyName" required></label>
        <label>رقم جوال الطوارئ<input type="tel" name="emergencyPhone" required></label>
        <button type="submit" class="primary-btn">احسب وادفع الآن</button>
      </form>
    `);
    modalContent.querySelector('#bookingForm').addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const trip = trips.find(t => t.id === formData.get('trip'));
      const extras = formData.getAll('extras');
      const extraCost = extras.reduce((sum, item) => sum + Number(item.split('|')[1] || 0), 0);
      const extraNames = extras.map(item => item.split('|')[0]).join(', ');
      addToCart({
        title: trip.title,
        subtitle: `حجز رحلة جاهزة${extraNames ? ' + ' + extraNames : ''}`,
        price: trip.price + extraCost,
      });
      state.previousBooking = {
        title: trip.title,
        price: trip.price + extraCost,
        date: formData.get('date'),
      };
      localStorage.setItem('rhPreviousBooking', JSON.stringify(state.previousBooking));
      closeModalDialog();
      alert('تمت إضافة الحجز إلى السلة مع الإضافات المختارة. سيتم إرسال إقرار المخاطر لاحقًا.');
    });
  }

  if (action === 'open-builder') {
    openModal(`
      <h2>جهّز رحلتك بنفسك</h2>
      <p>اختر المركبة، الأكل، والمعدات اللازمة فقط. لا نقدم مرشدين سياحيين ضمن الخدمة.</p>
      <form id="builderForm">
        <label>نوع الرحلة<select name="activity">
          <option value="تسلق">تسلق</option>
          <option value="غوص">غوص</option>
          <option value="تخييم">تخييم</option>
          <option value="مشاية جبلية">مشاية جبلية</option>
          <option value="صيد">صيد</option>
          <option value="رحلة شاطئية">رحلة شاطئية</option>
        </select></label>
        <label>اختر المركبة<select name="vehicle">
          <option value="لا يوجد">بدون مركبة</option>
          <option value="جيب صحراوي 4x4|65">جيب صحراوي 4x4 (+65 ر.ع)</option>
          <option value="دفع رباعي صغيرة|45">دفع رباعي صغيرة (+45 ر.ع)</option>
          <option value="دراجة جبلية|30">دراجة جبلية (+30 ر.ع)</option>
          <option value="جسكي|50">جسكي (+50 ر.ع)</option>
          <option value="كاياك|40">كاياك (+40 ر.ع)</option>
          <option value="فان كرافان|90">فان كرافان (+90 ر.ع)</option>
        </select></label>
        <label>أضف معدات<select name="gear">
          <option value="لا يوجد">لا توجد</option>
          <option value="حبل تسلق|18">حبل تسلق (+18 ر.ع)</option>
          <option value="بدلة غوص|22">بدلة غوص (+22 ر.ع)</option>
          <option value="عدة تخييم|35">عدة تخييم (+35 ر.ع)</option>
          <option value="عدة طبخ|28">عدة طبخ (+28 ر.ع)</option>
          <option value="عدة صيد|26">عدة صيد (+26 ر.ع)</option>
        </select></label>
        <label>اضافات الرحلة</label>
        <label><input type="checkbox" name="extras" value="وجبة خاصة|30"> وجبة خاصة (+30 ر.ع)</label>
        <label><input type="checkbox" name="extras" value="ماء واغذية|15"> ماء وأغذية (+15 ر.ع)</label>
        <button type="submit" class="primary-btn">احجز الآن</button>
      </form>
    `);
    modalContent.querySelector('#builderForm').addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const values = Object.fromEntries(formData.entries());
      const basePrice = 90;
      const vehiclePrice = values.vehicle.includes('|') ? Number(values.vehicle.split('|')[1]) : 0;
      const gearPrice = values.gear.includes('|') ? Number(values.gear.split('|')[1]) : 0;
      const extras = formData.getAll('extras');
      const extraPrice = extras.reduce((sum, item) => sum + Number(item.split('|')[1]), 0);
      const total = basePrice + vehiclePrice + gearPrice + extraPrice;
      const vehicleLabel = values.vehicle.includes('|') ? values.vehicle.split('|')[0] : values.vehicle;
      const gearLabel = values.gear.includes('|') ? values.gear.split('|')[0] : values.gear;
      addToCart({
        title: `رحلة مُخصّصة: ${values.activity}`,
        subtitle: `${vehicleLabel} / ${gearLabel}${extras.length ? ' / ' + extras.map(item => item.split('|')[0]).join(', ') : ''}`,
        price: total,
      });
      closeModalDialog();
      alert('تمت إضافة الرحلة المخصّصة إلى السلة. يمكنك تعديلها من السلة بعد ذلك.');
    });
  }

  if (action === 'open-shop') {
    openModal(`
      <h2>متجر المعدات</h2>
      <p>كل أنواع معدات الرحلات والنزهات: غوص، تسلق، تخييم، طبخ، صيد، ومشي.</p>
      <div class="note-box">اختر العدد والمعدات المناسبة لكل مغامرة أو رحلة بيدك.</div>
      <div class="product-list">
        ${gearItems.map(item => `
          <div class="cart-item">
            <strong>${item.title}</strong>
            <div>${item.description}</div>
            <div>فئة: ${item.category}</div>
            <div>السعر: ${item.price} ر.ع</div>
            <button data-action="add-gear" data-id="${item.id}">أضف إلى السلة</button>
          </div>
        `).join('')}
      </div>
    `);
    modalContent.querySelectorAll('[data-action="add-gear"]').forEach(button => {
      button.addEventListener('click', () => {
        const product = gearItems.find(item => item.id === button.dataset.id);
        addToCart({
          title: product.title,
          subtitle: `متجر المعدات - ${product.category}`,
          price: product.price,
        });
        alert('تمت إضافة الأداة إلى السلة.');
      });
    });
  }

  if (action === 'open-rental') {
    openModal(`
      <h2>حجز تأجير مركبة</h2>
      <p>التأجير يشمل مركبات الرحلات ومركبات الأنشطة، من الجيب الصحراوي إلى الدراجة الجبلية والجسكي.</p>
      <form id="rentalForm">
        <label>اختر المركبة<select name="vehicle">
          ${rentalVehicles.map(vehicle => `<option value="${vehicle.id}">${vehicle.title} — ${vehicle.price} ر.ع / يوم</option>`).join('')}
        </select></label>
        <label>من<input type="date" name="fromDate" required></label>
        <label>إلى<input type="date" name="toDate" required></label>
        <label>ارفع صورة رخصتك<input type="file" name="license" accept="image/*" required></label>
        <button type="submit" class="primary-btn">احجز التأجير</button>
      </form>
    `);
    modalContent.querySelector('#rentalForm').addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const vehicle = rentalVehicles.find(v => v.id === formData.get('vehicle'));
      const from = formData.get('fromDate');
      const to = formData.get('toDate');
      const days = vehicle ? Math.max(1, Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24))) : 1;
      const totalPrice = vehicle ? vehicle.price * days : 0;
      addToCart({
        title: vehicle ? `تأجير ${vehicle.title}` : 'تأجير مركبة',
        subtitle: vehicle ? `${vehicle.fuel} - ${vehicle.seats} مقاعد / ${days} يوم` : `${days} يوم`,
        price: totalPrice + 50,
      });
      closeModalDialog();
      alert('حجز التأجير مضاف للسلة. سيتم توثيق الحالة بالصور والفيديو عند التسليم.');
    });
  }

  if (action === 'open-supplier-form') {
    openModal(`
      <h2>طلب انضمام مورد</h2>
      <p>هذا النموذج يرسل طلباً للمراجعة فقط. لا يمنح المورد صلاحية النشر أو إدارة المحتوى على الموقع.</p>
      <form id="supplierForm">
        <label>نوع المورد<select name="supplierType">
          <option>شركة رحلات</option>
          <option>مالك مركبة</option>
          <option>بائع معدات</option>
          <option>مزود أكل</option>
          <option>فرد مستقل</option>
        </select></label>
        <label>الاسم التجاري / الاسم الشخصي<input type="text" name="businessName" required></label>
        <label>رقم السجل التجاري أو الهوية<input type="text" name="registrationNumber" placeholder="اتركه فارغًا إذا كنت فردًا بدون سجل" ></label>
        <label>ما الذي تريد عرضه على رحال؟<input type="text" name="offerPurpose" placeholder="رحلات، تأجير مركبة، معدات، طعام" required></label>
        <label>رفع وثيقة الترخيص أو الهوية<input type="file" name="licenseFile" accept="application/pdf,image/*" required></label>
        <label>رفع وثيقة التأمين<input type="file" name="insuranceFile" accept="application/pdf,image/*" required></label>
        <label>البيان البنكي<input type="text" name="bankAccount" required></label>
        <label><input type="checkbox" name="declaration" required> أقر بأنني أقدّم هذا الطلب للمراجعة ولا أمتلك صلاحية نشر أو إدارة في الموقع.</label>
        <button type="submit" class="primary-btn">إرسال طلب المراجعة</button>
      </form>
    `);
    modalContent.querySelector('#supplierForm').addEventListener('submit', event => {
      event.preventDefault();
      closeModalDialog();
      alert('طلب المورد أُرسل بنجاح. ستظهر حالته "قيد المراجعة" حتى الموافقة.');
    });
  }

  if (action === 'open-about') {
    openModal(`
      <h2>من نحن</h2>
      <p><strong>رحال</strong> — منصتك الشاملة لكل ما يخص الرحلات والمغامرات في الخليج.</p>
      <p>نؤمن أن التخطيط لرحلة مغامرة لا يجب أن يكون معقدًا. لذلك جمعنا في مكان واحد كل ما تحتاجه: رحلات جاهزة بكل تفاصيلها، أو حرية تجهيز رحلتك بنفسك — معدات، مركبات، وأكل — واختيار ما يناسبك بالضبط.</p>
      <p>رحال منصة تنسيق وحجز إلكترونية تربطك بمزودي خدمات مستقلين ومرخّصين (شركات رحلات، ملاك مركبات، بائعو معدات) عبر فاتورة واحدة وتجربة سلسة. نحرص على أن كل مورد لدينا مرخّص، وأن كل قطعة معدات مستعملة تمر بفحص وتنظيف قبل عرضها، لأن ثقتك هي أساس عملنا.</p>
      <p><strong>رؤيتنا:</strong> أن نكون الوجهة الأولى لعشّاق المغامرة في الخليج.</p>
      <p><strong>قيمنا:</strong> الشفافية، الجودة، وسهولة التجربة من أول خطوة لآخر رحلة.</p>
    `);
  }

  if (action === 'open-contact') {
    openModal(`
      <h2>تواصل معنا</h2>
      <p><strong>نحب نسمع منك — سواء عندك سؤال، استفسار عن حجز، أو تبي تنضم كمورد.</strong></p>
      <p>📧 البريد الإلكتروني: <a href="mailto:support@rahal.om">support@rahal.om</a></p>
      <p>📱 واتساب/هاتف: رقم الدعم</p>
      <p>🕐 أوقات العمل: السبت–الخميس، 9 صباحًا – 9 مساءً</p>
      <form id="contactForm">
        <label>الاسم الكامل<input type="text" name="fullName" required></label>
        <label>البريد الإلكتروني / رقم الجوال<input type="text" name="contactInfo" required></label>
        <label>نوع الاستفسار<select name="inquiryType" required>
          <option value="حجز رحلة">حجز رحلة</option>
          <option value="تأجير مركبة">تأجير مركبة</option>
          <option value="بيع أداة">بيع أداة</option>
          <option value="انضمام كمورد">انضمام كمورد</option>
          <option value="شكوى">شكوى</option>
          <option value="استفسار عام">استفسار عام</option>
        </select></label>
        <label>رقم الحجز (اختياري)<input type="text" name="bookingNumber" placeholder="يظهر فقط لحجز رحلة أو تأجير"></label>
        <label>نص الرسالة<textarea name="message" rows="4" required></textarea></label>
        <button type="submit" class="primary-btn">إرسال الرسالة</button>
      </form>
      <div class="note-box">
        <p><strong>رابط سريع:</strong> هل لديك مشكلة عاجلة بحجز حالي؟ <button class="link-btn" data-action="open-bookings">اذهب إلى صفحة حجوزاتي</button></p>
      </div>
    `);
    modalContent.querySelector('#contactForm').addEventListener('submit', event => {
      event.preventDefault();
      alert('شكراً لتواصلك. هذه نسخة توضيحية، وفي التطبيق الحقيقي سيتم إرسال النموذج للمعالجة.');
    });
  }

  if (action === 'open-bookings') {
    openModal(`
      <h2>حجوزاتي</h2>
      <p>في التطبيق الكامل، ستنتقل هنا مباشرة إلى صفحة الحجوزات الحالية لتتعامل مع المشكلة العاجلة دون انتظار الرد.</p>
      <p>هذا الديمو يعرض السلوك المتوقّع: تركيزنا على تجربة المستخدم وسرعة الوصول للمعلومات.</p>
    `);
  }

  if (action === 'open-terms') {
    openModal(`
      <h2>الشروط والأحكام</h2>
      <h3>المادة 1 — التعريفات</h3>
      <ul>
        <li><strong>رحال</strong>: المنصة الإلكترونية (الموقع والتطبيق) المملوكة لـ[اسم الشركة القانوني].</li>
        <li><strong>المستخدم</strong>: أي شخص يستخدم المنصة لحجز أو شراء خدمة.</li>
        <li><strong>المورد</strong>: أي طرف ثالث مستقل يعرض خدماته عبر المنصة (شركة رحلات، مالك مركبة، بائع معدات، مزود أكل).</li>
        <li><strong>الخدمة</strong>: أي رحلة، منتج، تأجير مركبة، أو وجبة معروضة عبر المنصة.</li>
        <li><strong>النشاط</strong>: أي فعالية بدنية أو مغامرة يقدمها المورد ضمن رحلة.</li>
      </ul>
      <h3>المادة 2 — طبيعة العلاقة</h3>
      <p>رحال تعمل كوسيط تقني ومالي يُيسّر التواصل والحجز بين المستخدم والمورد، وليست طرفًا في تنفيذ الخدمة نفسها. لا تُعد رحال منظم رحلات، ولا مالكة لأي مركبة، ولا بائعة مباشرة للمعدات المعروضة بنظام العرض بالعمولة. المسؤولية الكاملة عن سلامة تنفيذ الخدمة تقع على عاتق المورد المرخّص.</p>
      <h3>المادة 3 — شروط التسجيل كمورد</h3>
      <p>يقر كل مورد عند التسجيل بأنه:</p>
      <ol>
        <li>يحمل التراخيص السارية اللازمة لممارسة نشاطه وفق أنظمة الدولة.</li>
        <li>يحمل وثيقة تأمين سارية تغطي نشاطه.</li>
        <li>مسؤول عن دقة المعلومات المعروضة (الأسعار، التوفر، الأوصاف).</li>
        <li>يتحمل المسؤولية القانونية الكاملة عن أي ضرر ينشأ أثناء تنفيذ الخدمة.</li>
      </ol>
      <p>تحتفظ رحال بحق رفض أو تعليق أي مورد لا يستوفي هذه الشروط أو يخالفها لاحقًا.</p>
      <h3>المادة 4 — شروط الحجز والدفع</h3>
      <ul>
        <li>يُدفع كامل قيمة الخدمة مسبقًا عند تأكيد الحجز، باستثناء مبلغ التأمين القابل للاسترداد بتأجير المركبات، والذي يُعرض كبند منفصل بالفاتورة.</li>
        <li>تصدر فاتورة موحدة لكل عملية شراء، وقد تشمل خدمات من أكثر من مورد ضمن سلة واحدة.</li>
      </ul>
      <h3>المادة 5 — سياسة الإلغاء والاسترجاع</h3>
      <p>نوع الخدمة | السياسة</p>
      <ul>
        <li><strong>حجز رحلة</strong>: استرجاع كامل قبل [X] يومًا من موعد الرحلة، واسترجاع جزئي [نسبة%] بين [X] و[Y] يومًا، وبدون استرجاع بعد ذلك. تختلف النسب حسب سياسة كل مورد المعروضة بصفحة الرحلة.</li>
        <li><strong>تأجير مركبة</strong>: إلغاء مجاني حتى [X] ساعة قبل موعد الاستلام؛ التأمين يُخصم منه فقط في حال إثبات ضرر موثّق بالصور.</li>
        <li><strong>شراء منتج جديد</strong>: إرجاع خلال [X] يومًا بحالته الأصلية.</li>
        <li><strong>شراء منتج مستعمل</strong>: حسب سياسة المورد المعروضة بصفحة المنتج، نظرًا لطبيعة الحالة المستعملة.</li>
        <li><strong>سحب أداة من نظام العرض بالعمولة</strong>: يجوز لصاحب الأداة السحب في أي وقت قبل البيع، مقابل رسوم استرجاع [إن وجدت] تغطي تكلفة الفحص والتنظيف.</li>
      </ul>
      <h3>المادة 6 — إقرار المخاطر</h3>
      <p>تنطوي بعض الأنشطة (تسلق، غوص، ركوب مركبات ترفيهية) على مخاطر جسدية متأصلة. يُطلب من المستخدم التوقيع الإلكتروني على إقرار مخاطر خاص بالنشاط والمورد المحدد قبل تنفيذ النشاط، يقر فيه بفهمه للمخاطر وإخلائه مسؤولية رحال عن أي ضرر ينشأ أثناء التنفيذ.</p>
      <h3>المادة 7 — أحكام نظام العرض بالعمولة</h3>
      <ul>
        <li>يفوّض صاحب الأداة رحال بعرض أداته للبيع نيابة عنه بعد فحصها وتنظيفها.</li>
        <li>تُخصم عند البيع: (أ) عمولة بيع بنسبة [%]، و(ب) عمولة تنظيف وفحص بنسبة [%]، ويُحوَّل الصافي لصاحب الأداة خلال [X] أيام عمل.</li>
        <li>الحد الأقصى لمدة العرض [60] يومًا، وبعدها يُخفَّض السعر تلقائيًا أو تُعاد الأداة لصاحبها حسب اختياره.</li>
      </ul>
      <h3>المادة 8 — أحكام تأجير المركبات</h3>
      <ul>
        <li>مبلغ التأمين القابل للاسترداد بند منفصل تمامًا عن أجرة التأجير، ويُرد خلال [48] ساعة من تاريخ الاستلام ما لم يثبت ضرر موثّق.</li>
        <li>تُوثَّق حالة المركبة بالصور والفيديو عند التسليم وعند الاستلام، وتُعتمد كمرجع وحيد لأي نزاع.</li>
        <li>رحال منسّق فقط بين المستأجر والمالك، ولا تتحمل مسؤولية قانونية أو مادية عن المركبة أو أي حادث.</li>
      </ul>
      <h3>المادة 9 — الملكية الفكرية</h3>
      <p>جميع حقوق المحتوى والعلامة التجارية "رحال" والتصميم مملوكة للمنصة، ولا يجوز نسخها أو استخدامها دون إذن كتابي مسبق.</p>
      <h3>المادة 10 — حماية البيانات الشخصية</h3>
      <p>تُجمع بيانات المستخدم وتُستخدم وفق سياسة الخصوصية أدناه، ولا تُشارك مع الموردين إلا بالقدر اللازم لتنفيذ الخدمة المحجوزة.</p>
      <h3>المادة 11 — تسوية النزاعات والقانون الحاكم</h3>
      <p>تخضع هذه الشروط لأنظمة [سلطنة عُمان / الدولة المعنية]، وتُحال أي نزاعات للجهات القضائية المختصة فيها، مع تشجيع الطرفين على محاولة الحل الودي أولًا عبر خدمة العملاء.</p>
    `);
  }

  if (action === 'open-privacy') {
    openModal(`
      <h2>سياسة الخصوصية</h2>
      <h3>البيانات التي نجمعها</h3>
      <p>الاسم، بيانات التواصل، بيانات الدفع (تُعالج عبر بوابة دفع معتمدة ولا تُخزَّن أرقام البطاقات لدينا)، بيانات جهة الطوارئ عند حجز الأنشطة البدنية، وسجل الحجوزات.</p>
      <h3>كيف نستخدمها</h3>
      <p>لتنفيذ الحجز، التواصل بخصوصه، تحسين الخدمة، وإرسال عروض (يمكن إلغاء الاشتراك بها بأي وقت).</p>
      <h3>المشاركة مع أطراف ثالثة</h3>
      <p>تُشارك البيانات اللازمة فقط مع المورد المنفّذ للخدمة المحجوزة (مثل الاسم وتفاصيل الحجز)، ولا تُباع بيانات المستخدم لأي جهة تسويقية خارجية.</p>
      <h3>حقوق المستخدم</h3>
      <p>الاطلاع على بياناته، تصحيحها، أو طلب حذفها (ما لم يوجد التزام قانوني بالاحتفاظ بها، مثل السجلات المالية).</p>
      <p>التواصل بخصوص الخصوصية: <a href="mailto:privacy@rahal.om">privacy@rahal.om</a></p>
    `);
  }
}

function handleQuickRebook() {
  if (!state.previousBooking) {
    alert('لا يوجد حجز سابق لإعادة الحجز. أضف أولًا رحلة إلى السلة.');
    return;
  }

  addToCart({
    title: `إعادة حجز: ${state.previousBooking.title}`,
    subtitle: `تاريخ جديد قريب` ,
    price: state.previousBooking.price,
  });
  alert('تمت إضافة إعادة الحجز إلى السلة.');
}

function resumeCart() {
  if (state.cart.length === 0) {
    alert('السلة فارغة حاليًا. أضف عناصر ثم حاول الاستئناف.');
    return;
  }

  alert('تم استئناف السلة. يمكنك متابعة الدفع أو تعديل المحتوى.');
}

function completeCheckout() {
  if (state.cart.length === 0) {
    alert('السلة فارغة. أضف عناصر للمتابعة.');
    return;
  }

  window.location.href = 'checkout.html';
}

document.addEventListener('click', event => {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  if (actionElement.tagName === 'A') {
    event.preventDefault();
  }
  handleActions({ target: actionElement });
});

closeModal.addEventListener('click', closeModalDialog);
modalOverlay.addEventListener('click', closeModalDialog);
resumeButton.addEventListener('click', resumeCart);
checkoutButton.addEventListener('click', completeCheckout);
quickRebook.addEventListener('click', handleQuickRebook);

document.querySelectorAll('[data-action="browse-ready"]').forEach(btn => {
  btn.addEventListener('click', () => handleActions({ target: btn }));
});

document.querySelectorAll('[data-action="build-your-trip"]').forEach(btn => {
  btn.addEventListener('click', () => handleActions({ target: btn }));
});

function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.tab;
      tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      panels.forEach(panel => panel.classList.toggle('active', panel.id === `panel-${selected}`));
    });
  });
}

renderTrips();
renderCart();
renderDataSections();
setupTabs();
renderAdminDashboard();

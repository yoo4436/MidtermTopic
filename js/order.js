let customerLineId = ""; // 用來存客人的 LINE ID

// 【網頁一載入，立刻鎖住按鈕】
// 抓取你畫面中那個呼叫 submitOrder() 的按鈕
const submitBtn = document.querySelector('button[onclick="submitOrder()"]');

if (submitBtn) {
    submitBtn.disabled = true; // 鎖住不給按
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> 載入 LINE 資訊中...'; 
}

async function initializeLiff() {
    try {
        await liff.init({ liffId: "2009217421-BYARRXfx" });

        if (!liff.isLoggedIn()) {
            liff.login(); // 強制登入
        } else {
            const profile = await liff.getProfile();
            customerLineId = profile.userId; // 成功抓到客人的 ID！
            console.log("使用者已登入，ID:", customerLineId);

            if (submitBtn) {
                submitBtn.disabled = false; // 解除鎖定
                submitBtn.innerHTML = '送出訂單 <i class="bi bi-arrow-right-circle ms-1"></i>'; // 恢復文字
            }
        }
    } catch (error) {
        console.error("LIFF 初始化失敗", error);
    }
}

// 網頁載入時立刻執行
window.onload = function() {
    initializeLiff();
    scrollFunction();
    renderMenu();
};

// --- 1. 回到頂部按鈕邏輯 ---
let mybutton = document.getElementById("btn-back-to-top");
window.onscroll = function () { scrollFunction(); };
function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
function backToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// --- 2. 餐廳資料 ---
const stores = [
    "麥當勞-台中公益二餐廳",
    "麥當勞-台中文心二餐廳",
    "麥當勞-台中五權西餐廳"
];

// 動態生成下拉選單
const storeSelect = document.getElementById('store-select');
stores.forEach(store => {
    const option = document.createElement('option');
    option.value = store;
    option.textContent = store;
    storeSelect.appendChild(option);
});

// --- 3. 點餐系統核心邏輯 ---
const menuData = [
    // --- 早餐 ---
    { id: "bf1", name: "無敵豬肉滿福堡加蛋", price: 78, category: "breakfast", img: "./mc_menu/foodpic/bf1.avif" },
    { id: "bf2", name: "豬肉蛋堡", price: 66, category: "breakfast", img: "./mc_menu/foodpic/bf2.avif" },
    { id: "bf3", name: "鬆餅(3片)", price: 59, category: "breakfast", img: "./mc_menu/foodpic/bf3.avif" },
    { id: "bf4", name: "巧克力榛果可頌", price: 50, category: "breakfast", img: "./mc_menu/foodpic/bf4.avif" },
    { id: "bf5", name: "雞塊鬆餅大早餐", price: 115, category: "breakfast", img: "./mc_menu/foodpic/bf5.avif" },
    { id: "bf6", name: "番茄嫩蛋焙果堡", price: 71, category: "breakfast", img: "./mc_menu/foodpic/bf6.avif" },

    // --- 超值系列 ---
    { id: "cp1", name: "大麥克", price: 81, category: "cpseries", img: "./mc_menu/foodpic/cp1.avif" },
    { id: "cp2", name: "雙層牛肉吉事堡", price: 75, category: "cpseries", img: "./mc_menu/foodpic/cp2.avif" },
    { id: "cp3", name: "四盎司牛肉堡", price: 95, category: "cpseries", img: "./mc_menu/foodpic/cp3.avif" },
    { id: "cp4", name: "雙層四盎司牛肉堡", price: 135, category: "cpseries", img: "./mc_menu/foodpic/cp4.avif" },
    { id: "cp5", name: "勁辣鷄腿堡", price: 81, category: "cpseries", img: "./mc_menu/foodpic/cp5.avif" },
    { id: "cp6", name: "麥克鷄塊(10塊)", price: 110, category: "cpseries", img: "./mc_menu/foodpic/cp6.avif" },

    // --- 極選系列 ---
    { id: "se1", name: "蕈菇安格斯牛肉堡", price: 135, category: "selected", img: "./mc_menu/foodpic/signature1.avif" },
    { id: "se2", name: "帕瑪森主廚鷄腿堡", price: 130, category: "selected", img: "./mc_menu/foodpic/signature2.avif" },
    { id: "se3", name: "BLT 安格斯牛肉堡", price: 125, category: "selected", img: "./mc_menu/foodpic/signature3.avif" },

    // --- 超值配餐 ---
    { id: "sm1", name: "經典配餐:中薯+$38冷/熱飲", price: 65, category: "setmeal", img: "./mc_menu/foodpic/set1.avif" },
    { id: "sm2", name: "清爽配餐:沙拉+$38冷/熱飲", price: 70, category: "setmeal", img: "./mc_menu/foodpic/set2.avif" },
    { id: "sm3", name: "勁脆配餐:鷄腿1塊+$38冷/熱飲", price: 84, category: "setmeal", img: "./mc_menu/foodpic/set3.avif" },
    { id: "sm4", name: "炫冰配餐:OREO冰炫風®+小薯+$38冷/熱飲", price: 99, category: "setmeal", img: "./mc_menu/foodpic/set4.avif" },
    { id: "sm5", name: "豪吃配餐:六塊麥克鷄塊+小薯+$38冷/熱飲", price: 99, category: "setmeal", img: "./mc_menu/foodpic/set5.avif" },

    // --- Happy Meal ---
    { id: "hm1", name: "四塊麥克鷄塊 Happy Meal", price: 99, category: "happymeal", img: "./mc_menu/foodpic/hm1.avif" },
    { id: "hm2", name: "漢堡 Happy Meal", price: 99, category: "happymeal", img: "./mc_menu/foodpic/hm2.avif" },
    { id: "hm3", name: "陽光鱈魚堡 Happy Meal", price: 99, category: "happymeal", img: "./mc_menu/foodpic/hm3.avif" },

    // --- 分享盒 ---
    { id: "sb1", name: "麥克鷄塊分享盒(20塊)", price: 275, category: "sharebox", img: "./mc_menu/foodpic/share1.avif" },
    { id: "sb2", name: "麥脆鷄腿分享盒(6塊)", price: 508, category: "sharebox", img: "./mc_menu/foodpic/share2.avif" },
    { id: "sb3", name: "鷄塊鷄腿分享盒", price: 601, category: "sharebox", img: "./mc_menu/foodpic/share3.avif" },

    // --- 1+1星級點 ---
    { id: "op1", name: "吉事漢堡+紅茶(熱)", price: 50, category: "oneplusone", img: "./mc_menu/foodpic/one1.avif" },
    { id: "op2", name: "鷄塊(4塊)+無糖綠茶(小)", price: 50, category: "oneplusone", img: "./mc_menu/foodpic/one2.avif" },
    { id: "op3", name: "大蛋捲冰淇淋+無糖綠茶(小)", price: 50, category: "oneplusone", img: "./mc_menu/foodpic/one3.avif" },
    { id: "op4", name: "勁辣香鷄翅(兩塊)+雪碧(小)", price: 50, category: "oneplusone", img: "./mc_menu/foodpic/one4.avif" },
    { id: "op5", name: "麥香魚+雪碧(小)", price: 69, category: "oneplusone", img: "./mc_menu/foodpic/one5.avif" },
    { id: "op6", name: "麥克雙牛堡+檸檬風味紅茶(小)", price: 69, category: "oneplusone", img: "./mc_menu/foodpic/one6.avif" },

    // --- McCafé ---
    { id: "mc1", name: "經典那堤(冰)", price: 78, category: "mcafe", img: "./mc_menu/foodpic/cafe1.avif" },
    { id: "mc2", name: "經典卡布奇諾(冰)", price: 78, category: "mcafe", img: "./mc_menu/foodpic/cafe2.avif" },
    { id: "mc3", name: "經典美式咖啡(冰)", price: 65, category: "mcafe", img: "./mc_menu/foodpic/cafe3.avif" },
    { id: "mc4", name: "蜂蜜奶茶(冰)", price: 69, category: "mcafe", img: "./mc_menu/foodpic/cafe4.avif" },
    { id: "mc5", name: "蜂蜜紅茶(冰)", price: 59, category: "mcafe", img: "./mc_menu/foodpic/cafe5.avif" },
    { id: "mc6", name: "義式濃縮咖啡(熱)", price: 89, category: "mcafe", img: "./mc_menu/foodpic/cafe6.avif" },

    // --- 飲料 ---
    { id: "dr1", name: "Evian 礦泉水", price: 51, category: "beverage", img: "./mc_menu/foodpic/drink1.avif" },
    { id: "dr2", name: "鮮乳(盒裝)", price: 33, category: "beverage", img: "./mc_menu/foodpic/drink2.webp" },
    { id: "dr3", name: "台灣鮮榨柳丁汁(瓶裝)", price: 69, category: "beverage", img: "./mc_menu/foodpic/drink3.avif" },
    { id: "dr4", name: "可口可樂(中)", price: 38, category: "beverage", img: "./mc_menu/foodpic/drink4.avif" },
    { id: "dr5", name: "雪碧(中)", price: 38, category: "beverage", img: "./mc_menu/foodpic/drink5.avif" },
    { id: "dr6", name: "無糖綠茶 (冰)", price: 44, category: "beverage", img: "./mc_menu/foodpic/drink6.avif" },

    // --- 範例：點心 ---
    { id: "sn1", name: "水果袋", price: 43, category: "dessert", img: "./mc_menu/foodpic/de1.avif" },
    { id: "sn2", name: "玉米湯", price: 46, category: "dessert", img: "./mc_menu/foodpic/de2.avif" },
    { id: "sn3", name: "OREO冰炫風", price: 60, category: "dessert", img: "./mc_menu/foodpic/de3.avif" },
    { id: "sn4", name: "大蛋捲冰淇淋", price: 32, category: "dessert", img: "./mc_menu/foodpic/de4.avif" },
    { id: "sn5", name: "四季沙拉", price: 56, category: "dessert", img: "./mc_menu/foodpic/de5.avif" },
    { id: "sn6", name: "奶昔(香草風味)", price: 69, category: "dessert", img: "./mc_menu/foodpic/de6.avif" }
];

let cart = [];

function renderMenu(filter = 'all') {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    menuData.forEach(item => {
        if (filter !== 'all' && item.category !== filter) return;
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm hover-shadow">
                <img src="${item.img}" class="card-img-top" alt="${item.name}">
                <div class="card-body p-2 d-flex flex-column text-center">
                    <h6 class="card-title fw-bold" style="font-size: 0.9rem;">${item.name}</h6>
                    <div class="mt-auto pt-2">
                        <span class="text-danger fw-bold d-block mb-2">$${item.price}</span>
                        <button class="btn btn-sm btn-outline-danger w-100 rounded-pill" onclick="addToCart('${item.id}')">
                            <i class="bi bi-cart-plus"></i> 加入
                        </button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(col);
    });
}

function addToCart(id) {
    const item = menuData.find(p => p.id === id);
    const existingItem = cart.find(i => i.id === id);
    if (existingItem) {
        //數量上限判斷
        if (existingItem.qty >= 99) {
            alert("單一商品數量最多 99 個喔！");
            return;
        }
        existingItem.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="text-center text-muted mt-5"><i class="bi bi-basket display-1 opacity-50"></i><p class="mt-2">您的購物車是空的</p></div>`;
        totalEl.innerText = "$0";
        return;
    }

    let html = '<ul class="list-group list-group-flush">';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                <div class="me-2" style="font-size: 0.9rem; width: 50%;">
                    <div class="fw-bold text-truncate">${item.name}</div>
                    <div class="text-muted small">$${item.price}</div>
                </div>
                <div class="d-flex align-items-center bg-light rounded-pill p-1">
                    <button class="btn btn-quantity text-danger" onclick="changeQty(${index}, -1)">-</button>
                    <span class="mx-2 small fw-bold">${item.qty}</span>
                    <button class="btn btn-quantity text-success" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </li>
        `;
    });
    html += '</ul>';

    cartContainer.innerHTML = html;
    totalEl.innerText = "$" + total;
}

function changeQty(index, delta) {
    //數量上限判斷
    if (delta > 0 && cart[index].qty >= 99) {
        alert("單一商品數量最多 99 個喔！");
        return;
    }

    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
}

function filterMenu(category) {
    document.querySelectorAll('#category-buttons button').forEach(btn => {
        btn.classList.remove('btn-warning', 'active', 'fw-bold');
        btn.classList.add('btn-outline-dark');
    });
    event.target.classList.remove('btn-outline-dark');
    event.target.classList.add('btn-warning', 'active', 'fw-bold');
    renderMenu(category);
}

function submitOrder() {
    if (cart.length === 0) {
        alert("購物車是空的喔！");
        return;
    }

    //檢查是否選擇了餐廳
    const storeSelect = document.getElementById('store-select');
    const selectedStore = storeSelect.value;
    if (!selectedStore) {
        alert("請先選擇「取餐餐廳」才能送出訂單喔！");
        storeSelect.focus();
        storeSelect.classList.add('border-3'); // 加粗紅框提醒
        setTimeout(() => storeSelect.classList.remove('border-3'), 2000);
        return;
    }

    // ★ 新增：檢查電話
    const phoneInput = document.getElementById('customer-phone');
    const phone = phoneInput.value.trim();
    if (!phone || phone.length < 10) {
        alert("請輸入正確的手機號碼，以便日後查詢訂單！");
        phoneInput.focus();
        return;
    }

    const btn = document.querySelector('button[onclick="submitOrder()"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> 處理中...';

    // 確認已經有拿到 LINE ID 才能送單
    if (!customerLineId) {
        alert("正在讀取您的 LINE 帳號資訊，請稍後再試！\n(若持續發生，請重新整理網頁)");
        return;
    }

    // alert("準備送單，檢查抓到的 LINE ID: " + customerLineId);

    const payload = {
        items: cart.map(item => ({ id: item.id, qty: item.qty })),
        store: selectedStore,
        phone: phone,
        lineUserId: customerLineId // 把客人ID傳給後端
    };

    const scriptURL = "https://script.google.com/macros/s/AKfycbxDiQWoLMLKiuGuDtvAXmcuhCgP6L0RwqqJRWmvE0IFp5zZjyLrVh0KSkCZX7zpxBSx/exec";

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ 訂單成功！\n\n取餐店：" + selectedStore + "\n訂單編號：" + data.orderId + "\n確認金額：$" + data.serverTotal);
                cart = [];
                updateCartUI();
            } else {
                alert("❌ 發生錯誤：" + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("連線發生問題，請稍後再試。");
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
        });
}

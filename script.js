let currentUser = null;
let userBalance = 0;
let userInventory = [];
let currentWin = 0;

const casesData = {
    'fc-case': {
        name: 'FC-CASE',
        price: 400,
        items: [
            { amount: 100, chance: 30 },
            { amount: 300, chance: 25 },
            { amount: 450, chance: 25 },
            { amount: 500, chance: 15 },
            { amount: 1000, chance: 5 }
        ]
    }
};

function acceptConsent() {
    const checkbox = document.getElementById("consent");
    if (checkbox.checked) {
        document.getElementById("consent-section").style.display = "none";
        document.getElementById("nickname-section").style.display = "block";
    } else {
        showNotification("Пожалуйста, подтвердите согласие");
    }
}

function submitNickname() {
    const nicknameInput = document.getElementById("nickname");
    const nickname = nicknameInput.value.trim();
    
    if (!nickname) {
        showNotification("Введите ваш игровой никнейм");
        return;
    }
    
    currentUser = nickname;
    document.getElementById("nickname-section").style.display = "none";
    document.getElementById("main-section").style.display = "block";
    document.getElementById("user-header").style.display = "flex";
    document.getElementById("header-nickname").innerText = nickname;
    
    loadUserData();
    showNotification("Добро пожаловать в ECasino!");
}

function loadUserData() {
    const savedData = localStorage.getItem(`ecasino_${currentUser}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        userBalance = data.balance || 0;
        userInventory = data.inventory || [];
    }
    updateBalance(userBalance);
    updateInventory();
}

function saveUserData() {
    const data = {
        balance: userBalance,
        inventory: userInventory
    };
    localStorage.setItem(`ecasino_${currentUser}`, JSON.stringify(data));
}

function updateBalance(newBalance) {
    userBalance = newBalance;
    document.getElementById("user-balance").innerText = userBalance;
    document.getElementById("header-balance").innerText = userBalance;
    saveUserData();
}

function updateInventory() {
    const inventoryContainer = document.getElementById("inventory-items");
    if (userInventory.length === 0) {
        inventoryContainer.innerHTML = '<div class="inventory-item">Инвентарь пуст</div>';
        return;
    }
    
    inventoryContainer.innerHTML = '';
    userInventory.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <span>${item.amount} FC</span>
            <div class="item-actions">
                <button class="action-btn sell-btn" onclick="sellItem(${index})">💰</button>
                <button class="action-btn withdraw-btn" onclick="withdrawItem(${index})">📤</button>
            </div>
        `;
        inventoryContainer.appendChild(itemElement);
    });
}

function toggleInventory() {
    const inventory = document.getElementById("inventory-section");
    inventory.style.display = inventory.style.display === 'none' ? 'block' : 'none';
}

function showDepositForm() {
    document.getElementById("main-section").style.display = "none";
    document.getElementById("deposit-section").style.display = "block";
    document.getElementById("deposit-amount").value = "";
    document.getElementById("deposit-consent").checked = false;
    calculateCommission();
}

function backToMain() {
    document.getElementById("deposit-section").style.display = "none";
    document.getElementById("main-section").style.display = "block";
}

function calculateCommission() {
    const amount = parseInt(document.getElementById("deposit-amount").value) || 0;
    const commission = Math.floor(amount * 0.10);
    const finalAmount = amount - commission;
    
    document.getElementById("commission-calculation").innerHTML = 
        `Комиссия: ${commission} FC (10%)`;
    
    document.getElementById("final-amount").innerHTML = 
        `К зачислению: ${finalAmount} FC`;
}

function createDepositOrder() {
    const amount = parseInt(document.getElementById("deposit-amount").value);
    const consent = document.getElementById("deposit-consent").checked;
    
    if (!amount || amount <= 0) {
        showNotification("Введите корректную сумму");
        return;
    }
    
    if (!consent) {
        showNotification("Подтвердите понимание комиссии");
        return;
    }
    
    const commission = Math.floor(amount * 0.10);
    const finalAmount = amount - commission;
    
    showNotification(`Создан ордер на ${amount} FC. Ожидайте подтверждения.`);
    
    setTimeout(() => {
        backToMain();
    }, 3000);
}

function openCase(caseType) {
    const caseData = casesData[caseType];
    
    if (userBalance < caseData.price) {
        showNotification(`Недостаточно FC. Нужно: ${caseData.price} FC`);
        return;
    }
    
    updateBalance(userBalance - caseData.price);
    startCaseAnimation(caseData);
}

function startCaseAnimation(caseData) {
    const animation = document.createElement('div');
    animation.className = 'case-animation';
    animation.innerHTML = `
        <div class="spinning-item">🎰</div>
        <div class="spinning-item">🎲</div>
        <div class="spinning-item">🎯</div>
    `;
    document.body.appendChild(animation);
    
    setTimeout(() => {
        currentWin = calculateWin(caseData.items);
        
        animation.innerHTML = `
            <div class="result-item">🎉 ВЫ ВЫИГРАЛИ!</div>
            <div class="result-item">${currentWin} FC</div>
            <div class="result-buttons">
                <button class="result-btn sell-btn" onclick="sellWin()">💰 Продать</button>
                <button class="result-btn withdraw-btn" onclick="withdrawWin()">📤 В инвентарь</button>
            </div>
        `;
    }, 3000);
}

function calculateWin(items) {
    const random = Math.random() * 100;
    let accumulatedChance = 0;
    
    for (const item of items) {
        accumulatedChance += item.chance;
        if (random <= accumulatedChance) {
            return item.amount;
        }
    }
    return items[0].amount;
}

function sellWin() {
    updateBalance(userBalance + currentWin);
    document.querySelector('.case-animation').remove();
    showNotification(`Продано за ${currentWin} FC!`);
}

function withdrawWin() {
    userInventory.push({ amount: currentWin });
    updateInventory();
    saveUserData();
    document.querySelector('.case-animation').remove();
    showNotification(`Добавлено в инвентарь: ${currentWin} FC`);
}

function sellItem(index) {
    const item = userInventory[index];
    updateBalance(userBalance + item.amount);
    userInventory.splice(index, 1);
    updateInventory();
    showNotification(`Продано за ${item.amount} FC`);
}

function withdrawItem(index) {
    showNotification("Вывод предметов временно недоступен");
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: #ffd700;
        padding: 15px 25px;
        border-radius: 15px;
        border: 2px solid rgba(255, 215, 0, 0.3);
        z-index: 1000;
        font-size: 1.1em;
        text-align: center;
    `;
    
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

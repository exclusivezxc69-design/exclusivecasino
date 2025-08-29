let currentUser = null;
let userBalance = 0;

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

let gameLogs = [];

function acceptConsent() {
    const checkbox = document.getElementById("consent");
    if (checkbox.checked) {
        document.getElementById("consent-section").style.display = "none";
        document.getElementById("nickname-section").style.display = "block";
        showNotification("🎉 Благодарим за согласие! Приятной игры в ECasino!");
    } else {
        showNotification("⚠️ Пожалуйста, подтвердите согласие для продолжения");
    }
}

function submitNickname() {
    const nicknameInput = document.getElementById("nickname");
    const nickname = nicknameInput.value.trim();
    
    if (!nickname) {
        showNotification("✏️ Введите ваш игровой никнейм");
        nicknameInput.focus();
        return;
    }
    
    if (nickname.length < 3) {
        showNotification("📝 Никнейм должен содержать минимум 3 символа");
        nicknameInput.focus();
        return;
    }
    
    currentUser = nickname;
    document.getElementById("nickname-section").style.display = "none";
    document.getElementById("profile-section").style.display = "block";
    
    document.getElementById("user-nick").innerText = nickname;
    document.getElementById("header-nickname").innerText = nickname;
    
    document.getElementById("user-header").style.display = "flex";
    
    userBalance = 0;
    updateBalance(userBalance);
    
    showNotification("✅ Никнейм сохранен! Добро пожаловать в ECasino!");
}

function updateBalance(newBalance) {
    userBalance = newBalance;
    document.getElementById("user-balance").innerText = userBalance;
    document.getElementById("header-balance").innerText = userBalance;
}

function showDepositForm() {
    document.getElementById("profile-section").style.display = "none";
    document.getElementById("deposit-section").style.display = "block";
    document.getElementById("deposit-amount").value = "";
    document.getElementById("deposit-consent").checked = false;
    calculateCommission();
}

function showCases() {
    document.getElementById("profile-section").style.display = "none";
    document.getElementById("cases-section").style.display = "block";
}

function showInventory() {
    showNotification("🎒 Инвентарь будет доступен после открытия кейсов!");
}

function showWithdraw() {
    showNotification("📤 Вывод предметов будет доступен после выигрыша!");
}

function backToProfile() {
    const sections = ['cases-section', 'deposit-section', 'inventory-section', 'withdraw-section'];
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
    document.getElementById("profile-section").style.display = "block";
}

function calculateCommission() {
    const amount = parseInt(document.getElementById("deposit-amount").value) || 0;
    const commission = Math.floor(amount * 0.02);
    const finalAmount = amount - commission;
    
    document.getElementById("commission-calculation").innerHTML = 
        `📊 Комиссия ECasino: <strong>${commission} FC</strong> (2% от ${amount} FC)`;
    
    document.getElementById("final-amount").innerHTML = 
        `🎯 Вы получите: <strong>${finalAmount} FC</strong> на баланс`;
}

function createDepositOrder() {
    const amount = parseInt(document.getElementById("deposit-amount").value);
    const consent = document.getElementById("deposit-consent").checked;
    
    if (!amount || amount <= 0) {
        showNotification("🔢 Пожалуйста, введите корректную сумму");
        return;
    }
    
    if (!consent) {
        showNotification("✅ Пожалуйста, подтвердите понимание комиссии");
        return;
    }
    
    const commission = Math.floor(amount * 0.02);
    const finalAmount = amount - commission;
    
    showNotification(
        `💎 Создан ордер на ${amount} FC\n` +
        `📉 Комиссия: ${commission} FC (2%)\n` +
        `🎯 К зачислению: ${finalAmount} FC\n\n` +
        `⏳ Ожидайте подтверждения администратора!`
    );
    
    setTimeout(() => {
        backToProfile();
    }, 3000);
}

function openCase(caseType) {
    const caseData = casesData[caseType];
    
    if (!caseData) {
        showNotification("❌ Ошибка: кейс не найден");
        return;
    }
    
    if (userBalance < caseData.price) {
        showNotification(`❌ Недостаточно FC для открытия кейса!\n💎 Нужно: ${caseData.price} FC`);
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
        const winAmount = calculateWin(caseData.items);
        
        animation.innerHTML = `
            <div class="result-item">🎉 ВЫ ВЫИГРАЛИ!</div>
            <div class="result-item">${winAmount} FC 💎</div>
            <div class="result-item">🎊 Поздравляем!</div>
        `;
        
        updateBalance(userBalance + winAmount);
        addToGameLogs(caseData.name, winAmount);
        
        setTimeout(() => {
            document.body.removeChild(animation);
            showNotification(`🎊 Поздравляем! Вы выиграли ${winAmount} FC!`);
        }, 5000);
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

function addToGameLogs(caseName, winAmount) {
    const logEntry = {
        timestamp: new Date().toLocaleString(),
        username: currentUser,
        case: caseName,
        amount: winAmount
    };
    
    gameLogs.unshift(logEntry);
    if (gameLogs.length > 100) {
        gameLogs = gameLogs.slice(0, 100);
    }
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
        backdrop-filter: blur(10px);
        z-index: 1000;
        font-size: 1.1em;
        font-weight: 500;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
        animation: slideIn 0.3s ease-out;
    `;
    
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const nicknameSection = document.getElementById('nickname-section');
                if (nicknameSection.style.display === 'block') {
                    document.getElementById('nickname').focus();
                }
            }
        });
    });
    
    observer.observe(document.getElementById('nickname-section'), {
        attributes: true,
        attributeFilter: ['style']
    });
    
    showNotification("🎰 Добро пожаловать в ECasino! Готовы к большим выигрышам?");
});

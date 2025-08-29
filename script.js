let currentUser = null;
let userBalance = 0;

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
    
    // Загружаем баланс (заглушка)
    userBalance = 1000;
    document.getElementById("user-balance").innerText = userBalance;
    
    showNotification("✅ Никнейм сохранен! Добро пожаловать в ECasino!");
}

function showDepositForm() {
    // Здесь будет переход к форме пополнения
    showNotification("💎 Функция пополнения скоро будет доступна!");
}

function openCases() {
    showNotification("🎁 Раздел кейсов в разработке! Скоро будет доступен!");
}

function showInventory() {
    showNotification("🎒 Ваш инвентарь скоро будет доступен!");
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
        `💎 Создан ордер в ECasino на ${amount} FC\n` +
        `📉 Комиссия: ${commission} FC (2%)\n` +
        `🎯 К зачислению: ${finalAmount} FC\n\n` +
        `⏳ Ожидайте подтверждения администратора!`
    );
}

function showNotification(message) {
    // Создаем красивый toast вместо alert
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

// Добавляем стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translate(-50%, -100px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100px); opacity: 0; }
    }
    
    input::selection {
        background: rgba(255, 215, 0, 0.3);
        color: white;
    }
    
    input::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    
    input:-moz-placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    
    input::-moz-placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    
    input:-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
`;
document.head.appendChild(style);

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Фокус на поле ввода никнейма когда оно появляется
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

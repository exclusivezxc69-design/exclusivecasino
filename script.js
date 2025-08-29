let currentUser = null;

function acceptConsent() {
    const checkbox = document.getElementById("consent");
    if (checkbox.checked) {
        document.getElementById("consent-section").style.display = "none";
        document.getElementById("nickname-section").style.display = "block";
        showNotification("Благодарим за согласие! 💫");
    } else {
        showNotification("Пожалуйста, подтвердите согласие для продолжения 🎯");
    }
}

function submitNickname() {
    const nickname = document.getElementById("nickname").value;
    if (!nickname) {
        showNotification("Введите ваш игровой никнейм ✏️");
        return;
    }
    currentUser = nickname;
    document.getElementById("nickname-section").style.display = "none";
    document.getElementById("profile-section").style.display = "block";
    document.getElementById("user-nick").innerText = nickname;
    showNotification("Никнейм сохранен! Добро пожаловать в игру! 🎉");
}

function showDepositForm() {
    document.getElementById("profile-section").style.display = "none";
    document.getElementById("deposit-section").style.display = "block";
    document.getElementById("deposit-amount").value = "";
    document.getElementById("deposit-consent").checked = false;
    calculateCommission();
}

function backToProfile() {
    document.getElementById("deposit-section").style.display = "none";
    document.getElementById("profile-section").style.display = "block";
}

function calculateCommission() {
    const amount = parseInt(document.getElementById("deposit-amount").value) || 0;
    const commission = Math.floor(amount * 0.02);
    const finalAmount = amount - commission;
    
    document.getElementById("commission-calculation").innerHTML = 
        `📊 Комиссия: <strong>${commission} FC</strong> (2% от ${amount} FC)`;
    
    document.getElementById("final-amount").innerHTML = 
        `🎯 Вы получите: <strong>${finalAmount} FC</strong> на баланс`;
}

function createDepositOrder() {
    const amount = parseInt(document.getElementById("deposit-amount").value);
    const consent = document.getElementById("deposit-consent").checked;
    
    if (!amount || amount <= 0) {
        showNotification("Пожалуйста, введите корректную сумму 🔢");
        return;
    }
    
    if (!consent) {
        showNotification("Пожалуйста, подтвердите понимание комиссии ✅");
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
    
    // Здесь будет отправка запроса на создание ордера
    setTimeout(() => {
        backToProfile();
        showNotification("Администратор уведомлен! Спасибо за ожидание 🙏");
    }, 3000);
}

function showNotification(message) {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        Telegram.WebApp.showPopup({
            title: "ExclusiveCasino",
            message: message,
            buttons: [{ type: "ok" }]
        });
    } else {
        alert(message);
    }
}

// Анимация появления элементов
document.addEventListener('DOMContentLoaded', function() {
    showNotification("Добро пожаловать в ExclusiveCasino! 🎰");
});

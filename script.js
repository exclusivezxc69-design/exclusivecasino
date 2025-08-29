function acceptConsent() {
    const checkbox = document.getElementById("consent");
    if (checkbox.checked) {
        document.getElementById("consent-section").style.display = "none";
        document.getElementById("nickname-section").style.display = "block";
    } else {
        alert("Вы должны согласиться для продолжения");
    }
}

function submitNickname() {
    const nickname = document.getElementById("nickname").value;
    if (!nickname) {
        alert("Введите никнейм");
        return;
    }
    document.getElementById("nickname-section").style.display = "none";
    document.getElementById("profile-section").style.display = "block";
    document.getElementById("user-nick").innerText = nickname;
}

function depositFC() {
    let amount = prompt("Введите сумму для пополнения FC");
    if (!amount || isNaN(amount)) return;
    alert(`Создан ордер на ${amount} FC. Дождитесь подтверждения администратора.`);
}

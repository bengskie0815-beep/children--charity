// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

// Donate modal open/close
const donateModal = document.getElementById('donateModal');
document.getElementById('donateOpen')?.addEventListener('click', ()=> donateModal.showModal());
document.getElementById('donateOpenMobile')?.addEventListener('click', ()=> donateModal.showModal());
document.getElementById('donateOpenHero')?.addEventListener('click', ()=> donateModal.showModal());
document.getElementById('donateOpenBand')?.addEventListener('click', ()=> donateModal.showModal());
document.getElementById('donateClose')?.addEventListener('click', ()=> donateModal.close());

// Donation logic
let selectedAmount = 5; // default

// Handle preset buttons
document.querySelectorAll('.amounts button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amounts button').forEach(b => b.removeAttribute('aria-pressed'));
    btn.setAttribute('aria-pressed','true');
    selectedAmount = Number(btn.dataset.amount);
    document.getElementById('otherAmount').value = "";
  });
});

// Handle custom amount
document.getElementById('otherAmount').addEventListener('input', (e) => {
  selectedAmount = Number(e.target.value);
});

// Copy wallet address
document.getElementById('copyWallet')?.addEventListener('click', async () => {
  try {
    const addr = document.getElementById('usdtWallet').textContent.trim();
    await navigator.clipboard.writeText(addr);
    document.getElementById('copyWallet').textContent = "Copied!";
    setTimeout(() => document.getElementById('copyWallet').textContent = "Copy Wallet Address", 1500);
  } catch(e) {
    alert("Copy failed. Please copy manually.");
  }
});

// Thank You Modal function
function showThankYou(amount, method) {
  const thankYouModal = document.getElementById('thankYouModal');
  const msg = document.getElementById('thankYouMsg');
  msg.textContent = `Thank you for donating $${amount} via ${method}!`;
  thankYouModal.showModal();
}

document.getElementById('thankYouClose').addEventListener('click', () => {
  document.getElementById('thankYouModal').close();
});

// Donate Now
document.getElementById('donateNow').addEventListener('click', () => {
  if (!selectedAmount || selectedAmount < 1) {
    alert("Please enter a valid amount.");
    return;
  }

  const method = document.querySelector('input[name="payMethod"]:checked').value;

  if (method === "paypal") {
    showThankYou(selectedAmount, "PayPal");
    window.open(`https://www.paypal.com/ncp/payment/U8C8G3JXC8FA4?amount=${selectedAmount}`, "_blank");
  } 
  else if (method === "usdt") {
    showThankYou(selectedAmount, "USDT Wallet");
    document.getElementById('cryptoBox').classList.remove("hidden");
    QRCode.toCanvas(document.getElementById('walletQR'),
      "0xEE83d2EFDfa5821EF8Cd2f6bCCCDddbFFF30514a",
      { width: 160 },
      function (error) {
        if (error) console.error(error);
      }
    );
  }
  else if (method === "metamask") {
    if (typeof window.ethereum !== "undefined") {
      ethereum.request({ method: "eth_requestAccounts" })
        .then(accounts => {
          const from = accounts[0];
          const amountInWei = (selectedAmount * 1e18).toString(16);
          showThankYou(selectedAmount, "MetaMask");
          return ethereum.request({
            method: "eth_sendTransaction",
            params: [{
              from,
              to: "0xEE83d2EFDfa5821EF8Cd2f6bCCCDddbFFF30514a",
              value: "0x" + amountInWei
            }]
          });
        })
        .catch(err => alert("MetaMask error: " + err.message));
    } else {
      alert("MetaMask not detected.");
    }
  }
});

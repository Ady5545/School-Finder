document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "/api/auth";

  // ---------------- STATE ----------------
  let token = localStorage.getItem("authToken") || null;
  let isLoggedIn = !!token;
  let wishlist = [];
  let ratings = {};
  let pendingAdd = null;
  let username = localStorage.getItem("username") || "User";

  let emailGlobal = "";
  let usernameGlobal = "";
  let passwordGlobal = "";
  let countdown;

  // ---------------- ELEMENTS ----------------
  const authModal = document.getElementById("authModal");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn"); // Generate OTP
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");
  const closeModal = document.querySelector(".modal .close");

  const loginEmailInput = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");

  const regEmailInput = document.getElementById("registerEmail");
  const regUsernameInput = document.getElementById("registerUsername");
  const regPasswordInput = document.getElementById("registerPassword");
  const regConfirmPasswordInput = document.getElementById("registerConfirmPassword");

  const regErrors = {
    email: document.getElementById("regEmailError"),
    username: document.getElementById("regUsernameError"),
    password: document.getElementById("regPasswordError"),
    confirm: document.getElementById("regConfirmPasswordError")
  };

  const hearts = document.querySelectorAll(".heart");
  const wishlistArea = document.getElementById("wishlistArea");

  const userMenu = document.getElementById("userMenu");
  const userBtn = document.getElementById("userBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // ---------------- OTP POPUP ----------------
  const otpPopup = document.getElementById("otpPopup");
  const otpInputPopup = document.getElementById("otpInput");
  const otpTimer = document.getElementById("otpTimer");
  const resendBtn = document.getElementById("resendBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const otpError = document.getElementById("otpError"); // inline error message div
  const closeOtpBtn = otpPopup.querySelector(".close");

  // ---------------- LOAD USER DATA ----------------
  async function loadUserData() {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (data.success) {
        wishlist = data.wishlist || [];
        ratings = data.ratings || {};
        username = data.username || username;
        localStorage.setItem("username", username);
        isLoggedIn = true;
        updateWishlistUI();
        updateRatingsUI();
        updateLoginUI();
      }
    } catch (err) { console.error(err); }
  }
  loadUserData();

  // ---------------- MODAL SWITCH ----------------
  document.querySelectorAll(".login-btn,#heroLoginBtn,#loginBtnFloating").forEach(btn=>{
    btn.addEventListener("click",()=>{
      authModal.style.display="block";
      loginForm.style.display="block";
      registerForm.style.display="none";
    });
  });

  closeModal?.addEventListener("click",()=>{
    authModal.style.display="none";
    otpPopup.style.display="none";
    pendingAdd=null;
  });

  showRegister?.addEventListener("click",()=>{
    loginForm.style.display="none";
    registerForm.style.display="block";
  });

  showLogin?.addEventListener("click",()=>{
    registerForm.style.display="none";
    loginForm.style.display="block";
  });

  // ---------------- LOGIN ----------------
  loginBtn?.addEventListener("click", async () => {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();
    if(!email || !password) return;
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email,password})
      });
      const data = await res.json();
      if(data.success){
        token=data.token;
        wishlist=data.wishlist || [];
        ratings=data.ratings || {};
        localStorage.setItem("authToken",token);
        username=data.username || email.split("@")[0];
        localStorage.setItem("username",username);
        isLoggedIn=true;
        authModal.style.display="none";
        if(pendingAdd){
          toggleWishlist(pendingAdd);
          pendingAdd=null;
        }
        updateWishlistUI();
        updateRatingsUI();
        updateLoginUI();
      }
    } catch(err){ console.error(err); }
  });

  // ---------------- REGISTER VALIDATION ----------------
  function validateRegister() {
    let valid = true;
    const email = regEmailInput.value.trim();
    const usernameVal = regUsernameInput.value.trim();
    const passwordVal = regPasswordInput.value.trim();
    const confirmVal = regConfirmPasswordInput.value.trim();

    if(!email){ regErrors.email.textContent="Email is required"; valid=false; } 
    else if(!/\S+@\S+\.\S+/.test(email)){ regErrors.email.textContent="Invalid email"; valid=false; }
    else{ regErrors.email.textContent=""; }

    if(!usernameVal){ regErrors.username.textContent="Username required"; valid=false; }
    else{ regErrors.username.textContent=""; }

    if(!passwordVal){ regErrors.password.textContent="Password required"; valid=false; }
    else if(passwordVal.length<6){ regErrors.password.textContent="Min 6 chars"; valid=false; }
    else{ regErrors.password.textContent=""; }

    if(confirmVal!==passwordVal){ regErrors.confirm.textContent="Passwords must match"; valid=false; }
    else{ regErrors.confirm.textContent=""; }

    registerBtn.disabled = !valid;
    return valid;
  }

  [regEmailInput, regUsernameInput, regPasswordInput, regConfirmPasswordInput].forEach(input=>{
    input.addEventListener("input", validateRegister);
  });

  // ---------------- GENERATE OTP ----------------
  registerBtn?.addEventListener("click", async () => {
    if(!validateRegister()) return;

    emailGlobal = regEmailInput.value.trim();
    usernameGlobal = regUsernameInput.value.trim();
    passwordGlobal = regPasswordInput.value.trim();

    try {
      const res = await fetch(`${API_URL}/generate-otp`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email: emailGlobal})
      });
      const data = await res.json();
      if(data.success){
        openOtpPopup();
      } else {
        regErrors.email.textContent = data.message || "Failed to send OTP";
      }
    } catch(err){ console.error(err); regErrors.email.textContent="Server error"; }
  });

  function openOtpPopup(){
    otpPopup.style.display="flex"; // <-- make sure it's flex for centering
    otpInputPopup.value="";
    otpError.textContent="";
    startOtpCountdown();
  }

  function startOtpCountdown(){
    let time = 10;
    otpTimer.textContent = `00:${time<10?'0'+time:time}`;
    resendBtn.disabled = true;
    clearInterval(countdown);
    countdown = setInterval(()=>{
      time--;
      otpTimer.textContent = `00:${time<10?'0'+time:time}`;
      if(time<=0){
        clearInterval(countdown);
        resendBtn.disabled = false;
      }
    },1000);
  }

  // ---------------- CLOSE OTP ----------------
  closeOtpBtn?.addEventListener("click", ()=>{
    otpPopup.style.display="none";
  });

  window.addEventListener("click",(e)=>{
    if(e.target===otpPopup) otpPopup.style.display="none";
  });

  // ---------------- RESEND OTP ----------------
  resendBtn?.addEventListener("click", async ()=>{
    resendBtn.disabled = true;
    startOtpCountdown();
    try {
      const res = await fetch(`${API_URL}/generate-otp`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email: emailGlobal})
      });
      const data = await res.json();
      if(!data.success){
        otpError.textContent = data.message || "Failed to resend OTP";
      }
    } catch(err){ console.error(err); }
  });

  // ---------------- VERIFY OTP ----------------
  verifyOtpBtn?.addEventListener("click", async ()=>{
    const otpVal = otpInputPopup.value.trim();
    if(!otpVal){ otpError.textContent="Enter OTP"; return; }

    try {
      const res = await fetch(`${API_URL}/verify-otp`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email: emailGlobal, username: usernameGlobal, password: passwordGlobal, otp: otpVal})
      });
      const data = await res.json();
      if(data.success){
        token=data.token;
        wishlist = [];
        ratings = {};
        localStorage.setItem("authToken",token);
        localStorage.setItem("username",usernameGlobal);
        isLoggedIn=true;
        otpPopup.style.display="none";
        authModal.style.display="none";
        updateLoginUI();
        updateWishlistUI();
        updateRatingsUI();
      } else {
        otpError.textContent = data.message || "OTP incorrect";
      }
    } catch(err){ console.error(err); otpError.textContent="Server error"; }
  });

  // ---------------- WISHLIST ----------------
  hearts.forEach(h=>{
    h.addEventListener("click",e=>{
      e.stopPropagation();
      const school=h.dataset.school;
      if(!school) return;
      if(!isLoggedIn){ pendingAdd=school; authModal.style.display="block"; return; }
      toggleWishlist(school);
    });
  });

  function toggleWishlist(schoolName){
    const heart=[...hearts].find(h=>h.dataset.school===schoolName);
    if(!heart) return;
    const idx=wishlist.indexOf(schoolName);
    if(idx===-1){ wishlist.push(schoolName); heart.classList.add("wishlisted","bounce"); setTimeout(()=>heart.classList.remove("bounce"),500); }
    else{ wishlist.splice(idx,1); heart.classList.remove("wishlisted"); }
    updateWishlistUI();
    saveToBackend();
  }

  function updateWishlistUI(){
    if(!wishlistArea) return;
    wishlistArea.innerHTML="";
    hearts.forEach(h=>h.classList.toggle("wishlisted",wishlist.includes(h.dataset.school)));
    wishlist.forEach(n=>{ const d=document.createElement("div"); d.textContent=n; wishlistArea.appendChild(d); });
  }

  // ---------------- RATINGS ----------------
  document.querySelectorAll(".rating").forEach(rDiv => {
    const stars = rDiv.querySelectorAll(".star");
    const school = rDiv.dataset.school;
    stars.forEach((star,index)=>{
      star.addEventListener("mouseenter",()=>stars.forEach((s,i)=>s.classList.toggle("hovered",i<=index)));
      star.addEventListener("mouseleave",()=>stars.forEach(s=>s.classList.remove("hovered")));
      star.addEventListener("click",()=>{
        if(!isLoggedIn){ pendingAdd=null; authModal.style.display="block"; return; }
        ratings[school] = index+1;
        stars.forEach((s,i)=>s.classList.toggle("selected",i<=index));
        saveToBackend();
      });
    });
    const saved = ratings[school]||0;
    stars.forEach((s,i)=>s.classList.toggle("selected",i<saved));
  });

  function updateRatingsUI(){
    document.querySelectorAll(".rating").forEach(rDiv=>{
      const school=rDiv.dataset.school;
      const stars=rDiv.querySelectorAll(".star");
      const value=ratings[school]||0;
      stars.forEach((s,i)=>s.classList.toggle("selected",i<value));
    });
  }

  // ---------------- SAVE ----------------
  async function saveToBackend(){
    if(!token) return;
    try{
      await fetch(`${API_URL}/update`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({token,wishlist,ratings})
      });
    } catch(err){ console.error(err); }
  }

  // ---------------- LOGIN UI ----------------
  function updateLoginUI(){
    const loginButtons=document.querySelectorAll(".login-btn,#loginBtnFloating");
    if(isLoggedIn){
      loginButtons.forEach(btn=>btn.style.display="none");
      if(userMenu){ userMenu.style.display="inline-block"; userBtn.textContent=username; }
    } else {
      loginButtons.forEach(btn=>btn.style.display="inline-block");
      if(userMenu) userMenu.style.display="none";
    }
  }

  userBtn?.addEventListener("click",()=>{
    const dropdown=document.getElementById("userDropdown");
    dropdown.style.display = dropdown.style.display==="block" ? "none":"block";
  });

  document.addEventListener("click",(e)=>{
    const dropdown=document.getElementById("userDropdown");
    if(userMenu && !userMenu.contains(e.target)) dropdown.style.display="none";
  });

  logoutBtn?.addEventListener("click",()=>{
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    token=null;
    isLoggedIn=false;
    location.reload();
  });

  updateLoginUI();

});
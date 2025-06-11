document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 1;
  const totalSteps = 3;

  const tabs = document.querySelectorAll(".tab");
  const forms = document.querySelectorAll(".form");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      if (target === "signup") {
        currentStep = 1;
        updateSignupStep();
      }
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      forms.forEach((form) => {
        form.classList.remove("active");
        if (form.id === `${target}-form`) form.classList.add("active");
      });
    });
  });

  const signupSteps = document.querySelectorAll(".signup-step");
  const progressSteps = document.querySelectorAll(".step");
  const progressFill = document.querySelector(".progress-fill");
  const nextButtons = document.querySelectorAll(".next-btn");
  const backButtons = document.querySelectorAll(".back-btn");
  const schoolStatusSelect = document.getElementById("schoolStatus");
  const uniAffiliationGroup = document.getElementById("uni-affiliation-group");

  function updateSignupStep() {
    signupSteps.forEach((step, index) => {
      step.classList.toggle("active", index + 1 === currentStep);
    });
    progressSteps.forEach((step, index) => {
      if (index + 1 < currentStep) {
        step.classList.add("completed");
        step.classList.remove("active");
      } else if (index + 1 === currentStep) {
        step.classList.add("active");
        step.classList.remove("completed");
      } else {
        step.classList.remove("active", "completed");
      }
    });
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${progressPercentage}%`;
  }

  function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.signup-step[data-step="${currentStep}"]`);
    const requiredInputs = currentStepElement.querySelectorAll("input[required], select[required]");
    for (const input of requiredInputs) {
      if (!input.value.trim()) {
        input.focus();
        return false;
      }
    }
    if (currentStep === 1) {
      const password = document.getElementById("signup-password").value;
      if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return false;
      }
    }
    return true;
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (validateCurrentStep() && currentStep < totalSteps) {
        currentStep++;
        updateSignupStep();
      }
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateSignupStep();
      }
    });
  });

  if (schoolStatusSelect) {
    schoolStatusSelect.addEventListener("change", () => {
      if (schoolStatusSelect.value === "Post-Secondary") {
        uniAffiliationGroup.style.display = "block";
        document.getElementById("uniAffiliation").required = true;
      } else {
        uniAffiliationGroup.style.display = "none";
        const uniInput = document.getElementById("uniAffiliation");
        uniInput.required = false;
        uniInput.value = "";
      }
    });
  }

  const toggleButtons = document.querySelectorAll(".toggle-password");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.previousElementSibling;
      const icon = button.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });

  const signupPassword = document.getElementById("signup-password");
  const strengthSegments = document.querySelectorAll(".strength-segment");
  const strengthText = document.querySelector(".strength-text");

  if (signupPassword) {
    signupPassword.addEventListener("input", () => {
      const password = signupPassword.value;
      let strength = 0;
      strengthSegments.forEach((segment) => {
        segment.className = "strength-segment";
      });
      if (password.length > 0) {
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        for (let i = 0; i < strength; i++) {
          if (strength === 1) {
            strengthSegments[i].classList.add("weak");
          } else if (strength === 2 || strength === 3) {
            strengthSegments[i].classList.add("medium");
          } else {
            strengthSegments[i].classList.add("strong");
          }
        }
        if (strength === 1) {
          strengthText.textContent = "Weak password";
        } else if (strength === 2) {
          strengthText.textContent = "Fair password";
        } else if (strength === 3) {
          strengthText.textContent = "Good password";
        } else {
          strengthText.textContent = "Strong password";
        }
      } else {
        strengthText.textContent = "Password strength";
      }
    });
  }

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }
      console.log("Login attempt:", { email });
      alert("Login functionality would be implemented on the server side.");
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateCurrentStep()) return;
      if (!document.getElementById("terms").checked) {
        alert("Please accept the terms and conditions");
        return;
      }
      const formData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        dateOfBirth: document.getElementById("dateOfBirth").value,
        email: document.getElementById("signup-email").value.trim(),
        password: document.getElementById("signup-password").value,
        schoolStatus: document.getElementById("schoolStatus").value,
        uniAffiliation: document.getElementById("uniAffiliation").value.trim() || "None",
      };
      const submitBtn = signupForm.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      try {
        const res = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");
        alert("Account created 🎉");
        signupForm.reset();
        currentStep = 1;
        updateSignupStep();
      } catch (err) {
        alert(err.message);
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  const socialButtons = document.querySelectorAll(".social-btn");
  socialButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const provider = this.classList[1];
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would be implemented on the server side.`);
    });
  });

  updateSignupStep();
});

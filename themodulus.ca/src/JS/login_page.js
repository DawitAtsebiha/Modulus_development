document.addEventListener("DOMContentLoaded", () => {
  // State management
  let currentStep = 1;
  const totalSteps = 3;

  // DOM elements - cached once
  const elements = {
    tabs: document.querySelectorAll(".tab"),
    forms: document.querySelectorAll(".form"),
    signupSteps: document.querySelectorAll(".signup-step"),
    progressSteps: document.querySelectorAll(".step"),
    progressFill: document.querySelector(".progress-fill"),
    nextButtons: document.querySelectorAll(".next-btn"),
    backButtons: document.querySelectorAll(".back-btn"),
    schoolStatus: document.getElementById("schoolStatus"),
    uniAffiliationGroup: document.getElementById("uni-affiliation-group"),
    uniAffiliation: document.getElementById("uniAffiliation"),
    signupPassword: document.getElementById("signup-password"),
    strengthSegments: document.querySelectorAll(".strength-segment"),
    strengthText: document.querySelector(".strength-text"),
    loginForm: document.getElementById("login-form"),
    signupForm: document.getElementById("signup-form")
  };

  // Utility functions
  const addClass = (element, className) => element?.classList.add(className);
  const removeClass = (element, className) => element?.classList.remove(className);
  const toggleClass = (element, className, condition) => element?.classList.toggle(className, condition);

  // Tab switching functionality
  function initTabSwitching() {
    elements.tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        
        // Reset to step 1 when switching to signup
        if (target === "signup") {
          currentStep = 1;
          updateSignupStep();
        }

        // Update active tab
        elements.tabs.forEach(t => removeClass(t, "active"));
        addClass(tab, "active");

        // Show corresponding form
        elements.forms.forEach(form => {
          removeClass(form, "active");
          if (form.id === `${target}-form`) addClass(form, "active");
        });
      });
    });
  }

  // Multi-step signup functionality
  function updateSignupStep() {
    // Update step visibility
    elements.signupSteps.forEach((step, index) => {
      toggleClass(step, "active", index + 1 === currentStep);
    });

    // Update progress indicators
    elements.progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber < currentStep) {
        addClass(step, "completed");
        removeClass(step, "active");
      } else if (stepNumber === currentStep) {
        addClass(step, "active");
        removeClass(step, "completed");
      } else {
        removeClass(step, "active");
        removeClass(step, "completed");
      }
    });

    // Update progress bar
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (elements.progressFill) {
      elements.progressFill.style.width = `${progressPercentage}%`;
    }
  }

  function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.signup-step[data-step="${currentStep}"]`);
    if (!currentStepElement) return false;

    const requiredInputs = currentStepElement.querySelectorAll("input[required], select[required]");
    
    // Check all required fields
    for (const input of requiredInputs) {
      if (!input.value.trim()) {
        input.focus();
        return false;
      }
    }

    // Step 1 specific validation (password length)
    if (currentStep === 1) {
      const password = document.getElementById("signup-password")?.value;
      if (password && password.length < 8) {
        alert("Password must be at least 8 characters long");
        return false;
      }
    }

    return true;
  }

  function initStepNavigation() {
    // Next button handlers
    elements.nextButtons.forEach(button => {
      button.addEventListener("click", () => {
        if (validateCurrentStep() && currentStep < totalSteps) {
          currentStep++;
          updateSignupStep();
        }
      });
    });

    // Back button handlers
    elements.backButtons.forEach(button => {
      button.addEventListener("click", () => {
        if (currentStep > 1) {
          currentStep--;
          updateSignupStep();
        }
      });
    });
  }

  // School status conditional field
  function initSchoolStatusToggle() {
    if (!elements.schoolStatus) return;

    elements.schoolStatus.addEventListener("change", () => {
      const isPostSecondary = elements.schoolStatus.value === "Post-Secondary";
      
      if (elements.uniAffiliationGroup) {
        elements.uniAffiliationGroup.style.display = isPostSecondary ? "block" : "none";
      }
      
      if (elements.uniAffiliation) {
        elements.uniAffiliation.required = isPostSecondary;
        if (!isPostSecondary) elements.uniAffiliation.value = "";
      }
    });
  }

  // Password visibility toggle
  function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll(".toggle-password");
    toggleButtons.forEach(button => {
      button.addEventListener("click", () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector("i");
        
        if (input?.type === "password") {
          input.type = "text";
          removeClass(icon, "fa-eye");
          addClass(icon, "fa-eye-slash");
        } else if (input) {
          input.type = "password";
          removeClass(icon, "fa-eye-slash");
          addClass(icon, "fa-eye");
        }
      });
    });
  }

  // Password strength indicator
  function initPasswordStrength() {
    if (!elements.signupPassword) return;

    const strengthLevels = ["weak", "medium", "strong"];
    const strengthTexts = ["Weak password", "Fair password", "Good password", "Strong password"];

    elements.signupPassword.addEventListener("input", () => {
      const password = elements.signupPassword.value;
      let strength = 0;

      // Reset segments
      elements.strengthSegments.forEach(segment => {
        segment.className = "strength-segment";
      });

      if (password.length > 0) {
        // Calculate strength
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Apply visual feedback
        const levelClass = strength === 1 ? "weak" : strength <= 3 ? "medium" : "strong";
        for (let i = 0; i < strength; i++) {
          addClass(elements.strengthSegments[i], levelClass);
        }

        // Update text
        if (elements.strengthText) {
          elements.strengthText.textContent = strengthTexts[strength - 1] || strengthTexts[3];
        }
      } else if (elements.strengthText) {
        elements.strengthText.textContent = "Password strength";
      }
    });
  }

  // Form submission handlers
  function initFormHandlers() {
    // Login form
    if (elements.loginForm) {
      elements.loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const loginData = {
            email: document.getElementById("login-email")?.value.trim(),
            password: document.getElementById("login-password")?.value.trim()
        }

        const submitBtn = elements.loginForm.querySelector("button[type=submit]");
        if (submitBtn) submitBtn.disabled = true;

        try {
          const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Login failed");
          
        window.location.assign("dashboard.html"); 
        } catch (error) {
          alert(error.message);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    // Signup form
    if (elements.signupForm) {
      elements.signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        if (!validateCurrentStep()) return;
        
        const termsCheckbox = document.getElementById("terms");
        if (!termsCheckbox?.checked) {
          alert("Please accept the terms and conditions");
          return;
        }

        const formData = {
          firstName: document.getElementById("firstName")?.value.trim(),
          lastName: document.getElementById("lastName")?.value.trim(),
          dateOfBirth: document.getElementById("dateOfBirth")?.value,
          email: document.getElementById("signup-email")?.value.trim(),
          password: document.getElementById("signup-password")?.value,
          schoolStatus: document.getElementById("schoolStatus")?.value,
          uniAffiliation: document.getElementById("uniAffiliation")?.value.trim() || "None",
        };

        const submitBtn = elements.signupForm.querySelector("button[type=submit]");
        if (submitBtn) submitBtn.disabled = true;

        try {
          const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Signup failed");
          
        window.location.href = "/dashboard.html";

        } catch (error) {
          alert(error.message);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  }

  // Social login buttons
  function initSocialButtons() {
    const socialButtons = document.querySelectorAll(".social-btn");
    socialButtons.forEach(button => {
      button.addEventListener("click", function() {
        const provider = this.classList[1];
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
        alert(`${providerName} login would be implemented on the server side.`);
      });
    });
  }

  // Initialize all functionality
  function init() {
    initTabSwitching();
    initStepNavigation();
    initSchoolStatusToggle();
    initPasswordToggle();
    initPasswordStrength();
    initFormHandlers();
    initSocialButtons();
    updateSignupStep();
  }

  // Start the application
  init();
});
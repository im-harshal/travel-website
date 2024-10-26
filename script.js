/**
 * Date and Time Javascript
 */
function updateDateTime() {
  var now = new Date();
  var dateTimeString = now.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  document.getElementById("datetime").textContent = dateTimeString;
}

// Update the date and time immediately
updateDateTime();

// Update the date and time every minute (60000 milliseconds)
setInterval(updateDateTime, 60000);

/**
 * Background color and font change common for all html pages
 */
// Color options configuration
const colors = [
  { label: "Light Beige", value: "#F5E6D3" },
  { label: "Light Blue", value: "#D8E5F7" },
  { label: "Soft White", value: "#FAF9F6" },
  { label: "Deep Taupe", value: "#E0F0E3" },
  { label: "Beige", value: "#f5f5dc" },
];

// Initialize color options
function initColorOptions() {
  const colorOptionsContainer = document.getElementById("colorOptions");
  if (colorOptionsContainer) {
    colors.forEach((color) => {
      const button = document.createElement("button");
      button.className = "color-btn";
      button.style.backgroundColor = color.value;
      button.textContent = color.label;
      button.onclick = () => changeBackgroundColor(color.value);
      colorOptionsContainer.appendChild(button);
    });
  }
}

// Font size control
let currentFontSize = 16;

function initFontSizeControl() {
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");

  if (fontSizeSlider) {
    fontSizeSlider.addEventListener("input", (e) => {
      const newSize = parseInt(e.target.value);
      updateFontSize(newSize);
    });
  }
}

function changeFontSize(delta) {
  const newSize = Math.min(Math.max(currentFontSize + delta, 12), 24);
  const slider = document.getElementById("fontSizeSlider");
  if (slider) {
    slider.value = newSize;
    updateFontSize(newSize);
  }
}

function updateFontSize(size) {
  currentFontSize = size;
  const display = document.getElementById("fontSizeDisplay");
  if (display) {
    display.textContent = size;
  }
  const mainDiv = document.querySelector(".main-div");
  if (mainDiv) {
    mainDiv.style.fontSize = `${size}px`;
  }
}

// Background color control
function changeBackgroundColor(color) {
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.style.backgroundColor = color;

    // Update selected state of color buttons
    const buttons = document.querySelectorAll(".color-btn");
    buttons.forEach((button) => {
      if (button.style.backgroundColor === color) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });
  }
}

/**varsha's function for cars */
function submitCarForm() {
  // Get input values
  const city = document.getElementById("city").value.trim();
  const carType = document.getElementById("carType").value;
  const checkInDate = document.getElementById("checkInDate").value;
  const checkOutDate = document.getElementById("checkOutDate").value;
  const outputDiv = document.getElementById("output");
  
  // Validate empty fields
  if (!city || !carType || !checkInDate || !checkOutDate) {
    alert("All fields are required.");
    return;
  }


  // Validate date range
  const startDate = new Date("2024-09-01");
  const endDate = new Date("2024-12-01");
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn < startDate || checkIn > endDate || checkOut < startDate || checkOut > endDate) {
    alert("Dates must be between September 1, 2024, and December 1, 2024.");
    return;
  }

  if (checkOut <= checkIn) {
    alert("Check-out date must be after the check-in date.");
    return;
  }

  // Display entered information
  outputDiv.innerHTML = `
    <h3>Booking Details:</h3>
    <p><strong>City:</strong> ${city}</p>
    <p><strong>Car Type:</strong> ${carType}</p>
    <p><strong>Check-In Date:</strong> ${checkInDate}</p>
    <p><strong>Check-Out Date:</strong> ${checkOutDate}</p>
  `;
}

function validateForm() {
  // Get form values
  const destination = $("#destination").val().trim();
  const departingStartDate = $("#departingStartDate").val();
  const departingEndDate = $("#departingEndDate").val();
  const minDuration = parseInt($("#minDuration").val());
  const maxDuration = parseInt($("#maxDuration").val());
  const guests = parseInt($("#guests").val());
  const outputDiv = $("#output");

  // Valid destinations
  const validDestinations = ["Alaska", "Bahamas", "Europe", "Mexico"];
  
  // Date range for departing dates
  const minDate = new Date("2024-09-01");
  const maxDate = new Date("2024-12-01");
  const startDate = new Date(departingStartDate);
  const endDate = new Date(departingEndDate);

  // Validation checks
  if (!validDestinations.includes(destination)) {
    alert("Destination must be one of the following: Alaska, Bahamas, Europe, or Mexico.");
    return;
  }
  if (isNaN(minDuration) || minDuration < 3) {
    alert("Minimum duration must be at least 3 days.");
    return;
  }
  if (isNaN(maxDuration) || maxDuration > 10) {
    alert("Maximum duration cannot exceed 10 days.");
    return;
  }
  if (minDuration > maxDuration) {
    alert("Minimum duration cannot be greater than maximum duration.");
    return;
  }
  if (startDate < minDate || startDate > maxDate || endDate < minDate || endDate > maxDate) {
    alert("Departing dates must be between September 1, 2024, and December 1, 2024.");
    return;
  }
  if (startDate > endDate) {
    alert("Departing start date cannot be after the departing end date.");
    return;
  }
  if (guests > 2) {
    alert("Number of guests per room cannot exceed 2, except for infants staying with adults.");
    return;
  }

  // Display booking information if all inputs are valid
  outputDiv.html(`
    <h3>Booking Details:</h3>
    <p><strong>Destination:</strong> ${destination}</p>
    <p><strong>Departing Start Date:</strong> ${departingStartDate}</p>
    <p><strong>Departing End Date:</strong> ${departingEndDate}</p>
    <p><strong>Duration:</strong> ${minDuration} - ${maxDuration} days</p>
    <p><strong>Guests:</strong> ${guests} ${guests > 2 ? '(with infants)' : ''}</p>
  `);
}
/**
 * Contact Form specific functionality
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return; // Exit if form doesn't exist on current page

  // Phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      let formattedValue = "";

      if (value.length > 0) {
        formattedValue += "(" + value.substring(0, 3);
      }
      if (value.length > 3) {
        formattedValue += ") " + value.substring(3, 6);
      }
      if (value.length > 6) {
        formattedValue += "-" + value.substring(6, 10);
      }

      // Limit to 10 digits total
      if (value.length > 10) {
        value = value.substring(0, 10);
        formattedValue = formattedValue.substring(0, 14);
      }

      e.target.value = formattedValue;
    });
  }

  // Form submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset all error messages
    document.querySelectorAll(".error").forEach((error) => {
      error.classList.remove("error-visible");
    });

    let isValid = true;

    // First Name validation
    const firstName = document.getElementById("firstName").value;
    const firstNameRegex = /^[A-Z][a-z]*$/;
    if (!firstNameRegex.test(firstName)) {
      document.getElementById("firstNameError").classList.add("error-visible");
      isValid = false;
    }

    // Last Name validation
    const lastName = document.getElementById("lastName").value;
    const lastNameRegex = /^[A-Z][a-z]*$/;
    if (!lastNameRegex.test(lastName)) {
      document.getElementById("lastNameError").classList.add("error-visible");
      isValid = false;
    }

    // Check if first name and last name are the same
    if (firstName.toLowerCase() === lastName.toLowerCase()) {
      document.getElementById("sameNameError").classList.add("error-visible");
      isValid = false;
    }

    // Phone validation
    const phone = document.getElementById("phone").value;
    const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      document.getElementById("phoneError").classList.add("error-visible");
      isValid = false;
    }

    // Gender validation
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
      document.getElementById("genderError").classList.add("error-visible");
      isValid = false;
    }

    // Email validation
    const email = document.getElementById("email").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById("emailError").classList.add("error-visible");
      isValid = false;
    }

    // Comment validation
    const comment = document.getElementById("comment").value;
    if (comment.length < 10) {
      document.getElementById("commentError").classList.add("error-visible");
      isValid = false;
    }

    if (isValid) {
      alert("Form submitted successfully!");
      this.reset();
    }
  });
}

// Initialize everything when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  initColorOptions();
  initFontSizeControl();
  initContactForm(); // This will only initialize if the form exists
});

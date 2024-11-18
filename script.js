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
  { label: "Light Green", value: "#E0F0E3" },
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

/***
 *
 *
 * XML file related functions
 *
 *
 *
 */
// Function to create XML from form data
function createXMLFromContactForm(formData) {
  const xmlDoc = document.implementation.createDocument(
    null,
    "contactFormData"
  );
  const root = xmlDoc.documentElement;

  // Add timestamp
  const timestamp = xmlDoc.createElement("submissionTime");
  timestamp.textContent = new Date().toISOString();
  root.appendChild(timestamp);

  // Add form fields
  const fields = [
    "firstName",
    "lastName",
    "phone",
    "gender",
    "email",
    "comment",
  ];
  fields.forEach((field) => {
    const element = xmlDoc.createElement(field);
    element.textContent = formData[field];
    root.appendChild(element);
  });

  // Convert XML document to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
}

// Function to download XML file
function downloadXML(xmlString, filename) {
  const blob = new Blob([xmlString], { type: "application/xml" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
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

  if (
    checkIn < startDate ||
    checkIn > endDate ||
    checkOut < startDate ||
    checkOut > endDate
  ) {
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
    alert(
      "Destination must be one of the following: Alaska, Bahamas, Europe, or Mexico."
    );
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
  if (
    startDate < minDate ||
    startDate > maxDate ||
    endDate < minDate ||
    endDate > maxDate
  ) {
    alert(
      "Departing dates must be between September 1, 2024, and December 1, 2024."
    );
    return;
  }
  if (startDate > endDate) {
    alert("Departing start date cannot be after the departing end date.");
    return;
  }
  if (guests > 2) {
    alert(
      "Number of guests per room cannot exceed 2, except for infants staying with adults."
    );
    return;
  }

  // Display booking information if all inputs are valid
  outputDiv.html(`
    <h3>Booking Details:</h3>
    <p><strong>Destination:</strong> ${destination}</p>
    <p><strong>Departing Start Date:</strong> ${departingStartDate}</p>
    <p><strong>Departing End Date:</strong> ${departingEndDate}</p>
    <p><strong>Duration:</strong> ${minDuration} - ${maxDuration} days</p>
    <p><strong>Guests:</strong> ${guests} ${
    guests > 2 ? "(with infants)" : ""
  }</p>
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
      const formData = new FormData(contactForm);

      fetch("contact-us.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Form submitted successfully!");
            this.reset();
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          alert("An error occurred: " + error.message);
        });
    }
  });
}

function initStaysForm() {
  const staysForm = document.getElementById("staysForm");
  if (!staysForm) return;

  // Valid cities in Texas and California
  const validCities = [
    // Texas cities
    "austin",
    "houston",
    "dallas",
    "san antonio",
    "fort worth",
    // California cities
    "los angeles",
    "san francisco",
    "san diego",
    "sacramento",
    "san jose",
  ];

  // Date range constraints
  const minDate = new Date("2024-09-01");
  const maxDate = new Date("2024-12-01");

  function calculateRequiredRooms(adults, children) {
    // Calculate rooms needed based on max 2 people per room (excluding infants)
    const totalGuests = adults + children;
    return Math.ceil(totalGuests / 2);
  }

  function validateDate(date) {
    const selectedDate = new Date(date);
    return selectedDate >= minDate && selectedDate <= maxDate;
  }

  staysForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll(".error").forEach((error) => {
      error.classList.remove("error-visible");
    });

    let isValid = true;

    // Get form values
    const city = document.getElementById("city").value.toLowerCase().trim();
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const adults = parseInt(document.getElementById("adults").value) || 0;
    const children = parseInt(document.getElementById("children").value) || 0;
    const infants = parseInt(document.getElementById("infants").value) || 0;

    // City validation
    if (!validCities.includes(city)) {
      document.getElementById("cityError").classList.add("error-visible");
      isValid = false;
    }

    // Date validation
    if (!validateDate(checkIn)) {
      document.getElementById("checkInError").classList.add("error-visible");
      isValid = false;
    }

    if (!validateDate(checkOut)) {
      document.getElementById("checkOutError").classList.add("error-visible");
      isValid = false;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      document.getElementById("checkOutError").classList.add("error-visible");
      isValid = false;
    }

    // Guest validation
    if (adults < 1 || adults > 2) {
      document.getElementById("adultsError").classList.add("error-visible");
      isValid = false;
    }

    if (children > 2) {
      document.getElementById("childrenError").classList.add("error-visible");
      isValid = false;
    }

    if (infants < 0) {
      document.getElementById("infantsError").classList.add("error-visible");
      isValid = false;
    }

    if (isValid) {
      // Calculate required rooms
      const requiredRooms = calculateRequiredRooms(adults, children);

      // Display booking details
      const bookingDetails = document.getElementById("bookingDetails");
      bookingDetails.innerHTML = `
        <h3>Booking Details:</h3>
        <p><strong>City:</strong> ${
          city.charAt(0).toUpperCase() + city.slice(1)
        }</p>
        <p><strong>Check-in Date:</strong> ${checkIn}</p>
        <p><strong>Check-out Date:</strong> ${checkOut}</p>
        <p><strong>Number of Guests:</strong></p>
        <ul>
          <li>Adults: ${adults}</li>
          <li>Children: ${children}</li>
          <li>Infants: ${infants}</li>
        </ul>
        <div class="rooms-info">
          <p><strong>Required Rooms:</strong> ${requiredRooms}</p>
        </div>
      `;
      bookingDetails.classList.add("visible");
    }
  });

  // Add input event listeners for real-time validation
  document.getElementById("city").addEventListener("input", function (e) {
    const cityError = document.getElementById("cityError");
    if (validCities.includes(e.target.value.toLowerCase().trim())) {
      cityError.classList.remove("error-visible");
    }
  });

  document.getElementById("checkIn").addEventListener("change", function (e) {
    const checkInError = document.getElementById("checkInError");
    if (validateDate(e.target.value)) {
      checkInError.classList.remove("error-visible");
    }
  });

  document.getElementById("checkOut").addEventListener("change", function (e) {
    const checkOutError = document.getElementById("checkOutError");
    if (validateDate(e.target.value)) {
      checkOutError.classList.remove("error-visible");
    }
  });
}

function initFlightForm() {
  const flightForm = document.getElementById("flightForm");
  if (!flightForm) return;

  // Valid cities in Texas and California
  const validCities = [
    // Texas cities
    "austin",
    "houston",
    "dallas",
    "san antonio",
    "fort worth",
    // California cities
    "los angeles",
    "san francisco",
    "san diego",
    "sacramento",
    "san jose",
  ];

  // Date range constraints
  const minDate = new Date("2024-09-01");
  const maxDate = new Date("2024-12-01");

  // Trip type handling
  const tripTypeInputs = document.querySelectorAll('input[name="tripType"]');
  const returnDateGroup = document.querySelector(".return-date-group");

  tripTypeInputs.forEach((input) => {
    input.addEventListener("change", function () {
      returnDateGroup.style.display =
        this.value === "roundTrip" ? "block" : "none";
    });
  });

  // Passengers popup handling
  const passengersLabel = document.querySelector(".passengers-label");
  const passengersPopup = document.querySelector(".passengers-popup");
  let isPassengersPopupOpen = false;

  passengersLabel.addEventListener("click", function (e) {
    e.preventDefault();
    isPassengersPopupOpen = !isPassengersPopupOpen;
    passengersPopup.style.display = isPassengersPopupOpen ? "block" : "none";
  });

  // Close passengers popup when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !passengersLabel.contains(e.target) &&
      !passengersPopup.contains(e.target)
    ) {
      isPassengersPopupOpen = false;
      passengersPopup.style.display = "none";
    }
  });

  function validateDate(date) {
    const selectedDate = new Date(date);
    return selectedDate >= minDate && selectedDate <= maxDate;
  }

  function validateCity(city) {
    return validCities.includes(city.toLowerCase().trim());
  }

  flightForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll(".error").forEach((error) => {
      error.classList.remove("error-visible");
    });

    let isValid = true;

    // Get form values
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const departDate = document.getElementById("departDate").value;
    const returnDate = document.getElementById("returnDate").value;
    const tripType = document.querySelector(
      'input[name="tripType"]:checked'
    ).value;
    const adults = parseInt(document.getElementById("adults").value) || 0;
    const children = parseInt(document.getElementById("children").value) || 0;
    const infants = parseInt(document.getElementById("infants").value) || 0;

    // Validate origin
    if (!validateCity(origin)) {
      document.getElementById("originError").classList.add("error-visible");
      isValid = false;
    }

    // Validate destination
    if (!validateCity(destination)) {
      document
        .getElementById("destinationError")
        .classList.add("error-visible");
      isValid = false;
    }

    // Validate same city
    if (origin.toLowerCase().trim() === destination.toLowerCase().trim()) {
      document.getElementById("destinationError").textContent =
        "Origin and destination cannot be the same / Please select a city in Texas or California";
      document
        .getElementById("destinationError")
        .classList.add("error-visible");
      isValid = false;
    }

    // Validate departure date
    if (!validateDate(departDate)) {
      document.getElementById("departDateError").classList.add("error-visible");
      isValid = false;
    }

    // Validate return date for round trips
    if (tripType === "roundTrip") {
      if (!validateDate(returnDate)) {
        document
          .getElementById("returnDateError")
          .classList.add("error-visible");
        isValid = false;
      }

      const departDateTime = new Date(departDate);
      const returnDateTime = new Date(returnDate);
      if (returnDateTime <= departDateTime) {
        document.getElementById("returnDateError").textContent =
          "Return date must be after departure date";
        document
          .getElementById("returnDateError")
          .classList.add("error-visible");
        isValid = false;
      }
    }

    // Validate passenger counts
    if (adults < 1 || adults > 4) {
      document.getElementById("adultsError").classList.add("error-visible");
      isValid = false;
    }

    if (children > 4) {
      document.getElementById("childrenError").classList.add("error-visible");
      isValid = false;
    }

    if (infants > 4) {
      document.getElementById("infantsError").classList.add("error-visible");
      isValid = false;
    }

    if (isValid) {
      // Display booking details
      const bookingDetails = document.getElementById("bookingDetails");
      let detailsHTML = `
        <h3>Flight Booking Details:</h3>
        <p><strong>Trip Type:</strong> ${
          tripType === "oneWay" ? "One Way" : "Round Trip"
        }</p>
        <p><strong>Origin:</strong> ${
          origin.charAt(0).toUpperCase() + origin.slice(1)
        }</p>
        <p><strong>Destination:</strong> ${
          destination.charAt(0).toUpperCase() + destination.slice(1)
        }</p>
        <p><strong>Departure Date:</strong> ${departDate}</p>
      `;

      if (tripType === "roundTrip") {
        detailsHTML += `<p><strong>Return Date:</strong> ${returnDate}</p>`;
      }

      detailsHTML += `
        <p><strong>Passengers:</strong></p>
        <ul>
          <li>Adults: ${adults}</li>
          <li>Children: ${children}</li>
          <li>Infants: ${infants}</li>
          <li>Total Passengers: ${adults + children + infants}</li>
        </ul>
      `;

      bookingDetails.innerHTML = detailsHTML;
      bookingDetails.classList.add("visible");
    }
  });

  // Real-time validation
  document.getElementById("origin").addEventListener("input", function (e) {
    const error = document.getElementById("originError");
    if (validateCity(e.target.value)) {
      error.classList.remove("error-visible");
    }
  });

  document
    .getElementById("destination")
    .addEventListener("input", function (e) {
      const error = document.getElementById("destinationError");
      if (validateCity(e.target.value)) {
        error.classList.remove("error-visible");
      }
    });

  document
    .getElementById("departDate")
    .addEventListener("change", function (e) {
      const error = document.getElementById("departDateError");
      if (validateDate(e.target.value)) {
        error.classList.remove("error-visible");
      }
    });

  document
    .getElementById("returnDate")
    .addEventListener("change", function (e) {
      const error = document.getElementById("returnDateError");
      if (validateDate(e.target.value)) {
        error.classList.remove("error-visible");
      }
    });
}

// Initialize everything when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  initColorOptions();
  initFontSizeControl();
  initContactForm(); // This will only initialize if the form exists
  initStaysForm();
  initFlightForm();
});

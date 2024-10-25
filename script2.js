/**
 * Date and Time display
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

updateDateTime();
setInterval(updateDateTime, 60000);

/**
 * Display Settings for font size and background color
 */
const colors = [
  { label: "Light Beige", value: "#F5E6D3" },
  { label: "Light Blue", value: "#D8E5F7" },
  { label: "Soft White", value: "#FAF9F6" },
  { label: "Deep Taupe", value: "#E0F0E3" },
  { label: "Beige", value: "#f5f5dc" },
];

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

function changeBackgroundColor(color) {
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.style.backgroundColor = color;

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

/**
 * Passenger Form and Trip Type Toggle
 */
document.getElementById("passengerIcon").onclick = () => {
  const passengerForm = document.getElementById("passengerForm");
  passengerForm.style.display = passengerForm.style.display === "none" ? "block" : "none";
};

document.querySelectorAll('input[name="tripType"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    document.getElementById("returnDateDiv").style.display = e.target.value === "round-trip" ? "block" : "none";
  });
});

/**
 * Validate Form and Display Input Data
 */
function validateAndSearch() {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  const departureDate = document.getElementById("departureDate").value;
  const returnDate = document.getElementById("returnDate").value;
  const adults = parseInt(document.getElementById("adults").value, 10);
  const children = parseInt(document.getElementById("children").value, 10);
  const infants = parseInt(document.getElementById("infants").value, 10);
  const tripType = document.querySelector('input[name="tripType"]:checked').value;

  let isValid = true;
  let message = "";

  // Validate Origin and Destination (only cities in Texas or California)
  const cityRegex = /^(Austin|Dallas|Houston|San Antonio|Los Angeles|San Francisco|San Diego|Sacramento)$/;
  if (!cityRegex.test(origin) || !cityRegex.test(destination)) {
    message += "Origin and destination must be cities in Texas or California.<br>";
    isValid = false;
  }

  // Validate Departure Date
  const departure = new Date(departureDate);
  const minDate = new Date("2024-09-01");
  const maxDate = new Date("2024-12-01");
  if (departure < minDate || departure > maxDate) {
    message += "Departure date must be between September 1, 2024, and December 1, 2024.<br>";
    isValid = false;
  }

  // Validate Return Date for Round Trip
  if (tripType === "round-trip" && (!returnDate || new Date(returnDate) <= departure)) {
    message += "Return date must be after the departure date.<br>";
    isValid = false;
  }

  // Validate Number of Passengers (max 4 each category)
  if (adults > 4 || children > 4 || infants > 4) {
    message += "No more than 4 passengers allowed per category.<br>";
    isValid = false;
  }

  if (isValid) {
    document.getElementById("result").innerHTML = `
      <h3>Your Trip Details:</h3>
      <p>Trip Type: ${tripType === "one-way" ? "One Way" : "Round Trip"}</p>
      <p>Origin: ${origin}</p>
      <p>Destination: ${destination}</p>
      <p>Departure Date: ${departureDate}</p>
      ${tripType === "round-trip" ? `<p>Return Date: ${returnDate}</p>` : ""}
      <p>Adults: ${adults}, Children: ${children}, Infants: ${infants}</p>
    `;
  } else {
    document.getElementById("result").innerHTML = `<p style="color:red;">${message}</p>`;
  }
}

// Initialize settings when the document loads
document.addEventListener("DOMContentLoaded", () => {
  initColorOptions();
  initFontSizeControl();
});

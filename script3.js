/**
 * Date and Time Display
 */
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString(undefined, {
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
   * Display Settings for Font Size and Background Color
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
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.style.fontSize = `${size}px`;
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
   * Search Validation and Display for Stays
   */
  function validateAndSearchStay() {
    const city = document.getElementById("city").value;
    const checkInDate = document.getElementById("checkInDate").value;
    const checkOutDate = document.getElementById("checkOutDate").value;
    const adults = parseInt(document.getElementById("adults").value, 10);
    const children = parseInt(document.getElementById("children").value, 10);
    const infants = parseInt(document.getElementById("infants").value, 10);
  
    let isValid = true;
    let message = "";
  
    // City validation (only cities in Texas or California)
    const allowedCities = ["Austin", "Dallas", "Houston", "Richardson", "San Antonio", "Los Angeles", "San Francisco", "San Diego", "Sacramento"];
    if (!allowedCities.includes(city)) {
      message += "City must be in Texas or California.<br>";
      isValid = false;
    }
  
    // Date validation
    const minDate = new Date("2024-09-01");
    const maxDate = new Date("2024-12-01");
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
  
    if (checkIn < minDate || checkIn > maxDate) {
      message += "Check-in date must be between September 1, 2024, and December 1, 2024.<br>";
      isValid = false;
    }
    if (checkOut < minDate || checkOut > maxDate || checkOut <= checkIn) {
      message += "Check-out date must be after check-in and between September 1, 2024, and December 1, 2024.<br>";
      isValid = false;
    }
  
    // Room calculation and validation
    const guestsWithoutInfants = adults + children;
    let roomsNeeded = Math.ceil(guestsWithoutInfants / 2);
  
    if (isValid) {
      document.getElementById("stayResult").innerHTML = `
        <h3>Your Stay Details:</h3>
        <p>City: ${city}</p>
        <p>Check-in Date: ${checkInDate}</p>
        <p>Check-out Date: ${checkOutDate}</p>
        <p>Adults: ${adults}, Children: ${children}, Infants: ${infants}</p>
        <p>Rooms Needed: ${roomsNeeded}</p>
      `;
    } else {
      document.getElementById("stayResult").innerHTML = `<p style="color:red;">${message}</p>`;
    }
  }
  
  /**
   * Initialize Display Settings and Other Controls on Page Load
   */
  document.addEventListener("DOMContentLoaded", () => {
    initColorOptions();
    initFontSizeControl();
    updateDateTime();
  });
  
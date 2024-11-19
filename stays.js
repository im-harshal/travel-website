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
function initbook() {
    
    const bookForm = document.getElementById("bookForm");
    if (!bookForm) return;
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      // Gather form data
      const formData = new FormData(bookForm);
  
      // Send data to book.php
      fetch("stays/book.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Expecting JSON response from book.php
        })
        .then((data) => {
          // Redirect to cart.html with booking details as query parameters
          const queryString = new URLSearchParams(data).toString();
          window.location.href = `cart.html?${queryString}`;
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
  }
  
  
  function initStaysForm() {
    const staysForm = document.getElementById("staysForm");
    if (!staysForm) return;
  
    // Valid cities in Texas and California
    const validCities = [
      "austin", "houston", "dallas", "san antonio", "fort worth", // Texas
      "los angeles", "san francisco", "san diego", "sacramento", "san jose" // California
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
        // All validations passed. Submit data to the PHP backend via fetch()
        const formData = new FormData(staysForm);
  
        fetch("stays/search.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text(); // Expecting HTML response from PHP
          })
          .then((data) => {
            // Display PHP backend response
            const bookingDetails = document.getElementById("bookingDetails");
            bookingDetails.innerHTML = data;
            bookingDetails.classList.add("visible");
            initbook();
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          });
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
  document.addEventListener("DOMContentLoaded", () => {
    initColorOptions();
    initFontSizeControl();
    initStaysForm();
  });
  
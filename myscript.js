document.addEventListener("DOMContentLoaded", () => {
  const validCities = [
    "austin", "houston", "dallas", "san antonio", "fort worth",
    "los angeles", "san francisco", "san diego", "sacramento", "san jose"
  ];

  const minDate = new Date("2024-09-01");
  const maxDate = new Date("2024-12-01");

  const tripTypeInputs = document.querySelectorAll('input[name="tripType"]');
  const returnDateGroup = document.getElementById("returnDateGroup");
  const passengerIcon = document.getElementById("passengerIcon");
  const passengerForm = document.getElementById("passengerForm");
  const closePassengerForm = document.getElementById("closePassengerForm");
  const searchFlightsButton = document.getElementById("searchFlights");
  const errorDiv = document.getElementById("error");
  const outputDiv = document.getElementById("output");

  // Toggle return date visibility based on trip type
  tripTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value === "roundTrip") {
        returnDateGroup.style.display = "block";
      } else {
        returnDateGroup.style.display = "none";
      }
    });
  });

  // Toggle passenger form visibility
  passengerIcon.addEventListener("click", () => {
    passengerForm.style.display = passengerForm.style.display === "block" ? "none" : "block";
  });

  closePassengerForm.addEventListener("click", () => {
    passengerForm.style.display = "none";
  });

  // Validate city input
  function validateCity(city) {
    return validCities.includes(city.toLowerCase().trim());
  }

  // Validate date input
  function validateDate(date) {
    const selectedDate = new Date(date);
    return selectedDate >= minDate && selectedDate <= maxDate;
  }

  // Display error message
  function showError(message) {
    errorDiv.textContent = message;
    outputDiv.innerHTML = "";
  }

  // Display available flights
  function displayFlights(flights, type) {
    const header = type === "departing" ? "Available Departing Flights" : "Available Returning Flights";
    outputDiv.innerHTML += `<h3>${header}</h3>`;

    flights.forEach(flight => {
      const flightCard = document.createElement("div");
      flightCard.style.border = "1px solid #ccc";
      flightCard.style.padding = "10px";
      flightCard.style.margin = "10px 0";

      flightCard.innerHTML = `
        <p><strong>Flight ID:</strong> ${flight.flightId}</p>
        <p><strong>Origin:</strong> ${flight.origin}</p>
        <p><strong>Destination:</strong> ${flight.destination}</p>
        <p><strong>Departure Date:</strong> ${flight.departureDate}</p>
        <p><strong>Arrival Date:</strong> ${flight.arrivalDate}</p>
        <p><strong>Departure Time:</strong> ${flight.departureTime}</p>
        <p><strong>Arrival Time:</strong> ${flight.arrivalTime}</p>
        <p><strong>Available Seats:</strong> ${flight.availableSeats}</p>
        <p><strong>Price:</strong> $${flight.price}</p>
        <button class="select-flight" data-flight='${JSON.stringify(flight)}' data-type='${type}'>Select ${type === "departing" ? "Departing" : "Returning"} Flight</button>
      `;

      outputDiv.appendChild(flightCard);
    });

    // Add event listeners for "Select Flight" buttons
    document.querySelectorAll(".select-flight").forEach(button => {
      button.addEventListener("click", (e) => {
        const selectedFlight = JSON.parse(e.target.dataset.flight);
        const type = e.target.dataset.type;
        localStorage.setItem(`${type}Flight`, JSON.stringify(selectedFlight));
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} flight selected!`);
      });
    });
  }

  // Handle search button click
  searchFlightsButton.addEventListener("click", async () => {
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const departDate = document.getElementById("departDate").value;
    const returnDate = document.getElementById("returnDate").value;
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);
    const infants = parseInt(document.getElementById("infants").value);

    // Validate input
    if (!validateCity(origin) || !validateCity(destination)) {
      showError("Invalid origin or destination. Please select a valid city in Texas or California.");
      return;
    }

    if (!validateDate(departDate)) {
      showError("Invalid departure date. Please select a date between September 1, 2024, and December 1, 2024.");
      return;
    }

    if (tripTypeInputs[1].checked && !validateDate(returnDate)) {
      showError("Invalid return date. Please select a date between September 1, 2024, and December 1, 2024.");
      return;
    }

    if (adults > 4 || children > 4 || infants > 4) {
      showError("Each passenger category (adults, children, infants) cannot exceed 4.");
      return;
    }

    const totalPassengers = adults + children + infants;

    try {
      outputDiv.innerHTML = "";

      // Fetch departing flights
      const departingResponse = await fetch("flight_search_handler.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin,
          destination,
          date: departDate,
          passengers: totalPassengers,
        }),
      });

      if (!departingResponse.ok) {
        const errorData = await departingResponse.json();
        showError(errorData.error || "An error occurred while fetching departing flights.");
        return;
      }

      const departingData = await departingResponse.json();
      if (departingData.flights && departingData.flights.length > 0) {
        displayFlights(departingData.flights, "departing");
      } else {
        showError("No departing flights available for the selected criteria.");
      }

      // Fetch returning flights if round trip is selected
      if (tripTypeInputs[1].checked) {
        const returningResponse = await fetch("flight_search_handler.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin: destination,
            destination: origin,
            date: returnDate,
            passengers: totalPassengers,
          }),
        });

        if (!returningResponse.ok) {
          const errorData = await returningResponse.json();
          console.error("Returning flights error: ", errorData);
          showError("Error fetching returning flights. Please try again later.");
          return;
        }

        const returningData = await returningResponse.json();
        if (returningData.flights && returningData.flights.length > 0) {
          displayFlights(returningData.flights, "returning");
        } else {
          console.warn("No returning flights found.");
          showError("No returning flights available for the selected criteria.");
        }
      }
    } catch (error) {
      console.error("Fetch error: ", error);
      showError("An error occurred while connecting to the server. Please try again later.");
    }
  });
});







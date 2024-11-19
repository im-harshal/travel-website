document.addEventListener("DOMContentLoaded", () => {
    // Toggle visibility of the return date based on the selected trip type
    const tripTypeRadios = document.getElementsByName("tripType");
    const returnDateField = document.getElementById("returnDateField");

    tripTypeRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (document.getElementById("roundTrip").checked) {
                returnDateField.style.display = "block";
            } else {
                returnDateField.style.display = "none";
            }
        });
    });

    // Handle the flight search form submission
    document.getElementById("flightSearchForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const tripType = document.querySelector("input[name='tripType']:checked").value;
        const origin = document.getElementById("origin").value;
        const destination = document.getElementById("destination").value;
        const departureDate = document.getElementById("departureDate").value;
        const returnDate = document.getElementById("returnDate").value || null;
        const adults = parseInt(document.getElementById("adults").value);
        const children = parseInt(document.getElementById("children").value);
        const infants = parseInt(document.getElementById("infants").value);
        const totalPassengers = adults + children + infants;

        // Validate return date > departure date for Round-Trips
        if (tripType === "roundTrip" && new Date(returnDate) <= new Date(departureDate)) {
            alert("Return date must be after the departure date.");
            return;
        }

        // Save passenger details directly in localStorage
        localStorage.setItem("adults", adults);
        localStorage.setItem("children", children);
        localStorage.setItem("infants", infants);

        try {
            // Send a POST request to flight.php
            const response = await fetch("flight.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    origin,
                    destination,
                    date: departureDate,
                    returnDate: tripType === "roundTrip" ? returnDate : null,
                    passengers: totalPassengers,
                }),
            });

            const flightData = await response.json();

            // Dynamically display results
            displayResults(tripType, flightData.departure, flightData.return);
        } catch (error) {
            console.error("Error fetching flights:", error);
            alert("Failed to fetch flights. Please try again.");
        }
    });
});

// Function to dynamically display flight search results
function displayResults(tripType, departureFlights, returnFlights) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // Clear previous results

    // Display departure flights
    if (departureFlights && departureFlights.length > 0) {
        const departureSection = document.createElement("div");
        departureSection.innerHTML = "<h3>Departing Flights</h3>";
        departureFlights.forEach((flight) => {
            const flightDiv = createFlightCard(flight, true);
            departureSection.appendChild(flightDiv);
        });
        resultsContainer.appendChild(departureSection);
    } else {
        resultsContainer.innerHTML += "<p>No departing flights available.</p>";
    }

    // Display return flights for Round-Trips
    if (tripType === "roundTrip" && returnFlights && returnFlights.length > 0) {
        const returnSection = document.createElement("div");
        returnSection.innerHTML = "<h3>Returning Flights</h3>";
        returnFlights.forEach((flight) => {
            const flightDiv = createFlightCard(flight, false);
            returnSection.appendChild(flightDiv);
        });
        resultsContainer.appendChild(returnSection);
    } else if (tripType === "roundTrip") {
        resultsContainer.innerHTML += "<p>No returning flights available.</p>";
    }
}

// Function to create a flight card
function createFlightCard(flight, isDeparting) {
    const flightDiv = document.createElement("div");
    flightDiv.classList.add("flight-details");

    flightDiv.innerHTML = `
        <p><strong>Flight ID:</strong> ${flight.id}</p>
        <p><strong>Origin:</strong> ${flight.origin}</p>
        <p><strong>Destination:</strong> ${flight.destination}</p>
        <p><strong>Departure Date:</strong> ${flight.departureDate}</p>
        <p><strong>Arrival Date:</strong> ${flight.arrivalDate}</p>
        <p><strong>Departure Time:</strong> ${flight.departureTime}</p>
        <p><strong>Arrival Time:</strong> ${flight.arrivalTime}</p>
        <p><strong>Available Seats:</strong> ${flight.availableSeats}</p>
        <p><strong>Price:</strong> $${flight.price.toFixed(2)}</p>
    `;

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = isDeparting
        ? "Add as Departing Flight"
        : "Add as Returning Flight";
    addToCartButton.addEventListener("click", () => {
        addToCart(flight, isDeparting);
    });

    const removeFromCartButton = document.createElement("button");
    removeFromCartButton.textContent = isDeparting
        ? "Remove Departing Flight"
        : "Remove Returning Flight";
    removeFromCartButton.addEventListener("click", () => {
        removeFromCart(isDeparting);
    });

    flightDiv.appendChild(addToCartButton);
    flightDiv.appendChild(removeFromCartButton);
    return flightDiv;
}

// Function to add flights to cart
function addToCart(flight, isDeparting) {
    const key = isDeparting ? "departingFlight" : "returningFlight";
    localStorage.setItem(key, JSON.stringify(flight));
    alert(`${isDeparting ? "Departing" : "Returning"} flight added to cart.`);
}

// Function to remove flights from cart
function removeFromCart(isDeparting) {
    const key = isDeparting ? "departingFlight" : "returningFlight";
    localStorage.removeItem(key);
    alert(`${isDeparting ? "Departing" : "Returning"} flight removed from cart.`);
}

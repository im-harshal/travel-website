document.addEventListener("DOMContentLoaded", () => {
    // Load flight details from localStorage
    const departingFlight = JSON.parse(localStorage.getItem("departingFlight"));
    const returningFlight = JSON.parse(localStorage.getItem("returningFlight"));
    const adults = parseInt(localStorage.getItem("adults")) || 0;
    const children = parseInt(localStorage.getItem("children")) || 0;
    const infants = parseInt(localStorage.getItem("infants")) || 0;

    // Prevent duplicate additions
    const selectedFlights = new Set();

    // Display flight details
    if (departingFlight && !selectedFlights.has(departingFlight.id)) {
        displayFlightDetails(departingFlight, "departing-flight-details");
        selectedFlights.add(departingFlight.id);
    }

    if (returningFlight && !selectedFlights.has(returningFlight.id)) {
        document.getElementById("returning-flight").style.display = "block";
        displayFlightDetails(returningFlight, "returning-flight-details");
        selectedFlights.add(returningFlight.id);
    }

    // Calculate and display total price
    const totalPrice = calculateTotalPrice(departingFlight, returningFlight, adults, children, infants);
    document.getElementById("price-display").textContent = `$${totalPrice.toFixed(2)}`;

    // Add passenger fields dynamically
    const passengerFields = document.getElementById("passenger-fields");
    const totalPassengers = adults + children + infants;
    for (let i = 0; i < totalPassengers; i++) {
        const passengerDiv = document.createElement("div");
        passengerDiv.classList.add("passenger-details");
        passengerDiv.innerHTML = `
            <h5>Passenger ${i + 1}</h5>
            <label>First Name: <input type="text" required></label>
            <label>Last Name: <input type="text" required></label>
            <label>Date of Birth: <input type="date" required></label>
            <label>SSN: <input type="text" required></label>
        `;
        passengerFields.appendChild(passengerDiv);
    }

    // Handle booking confirmation
    document.getElementById("confirm-booking").addEventListener("click", () => {
        const passengers = [...document.querySelectorAll(".passenger-details")].map((div, index) => ({
            firstName: div.querySelector("input[type='text']").value,
            lastName: div.querySelectorAll("input[type='text']")[1].value,
            dob: div.querySelector("input[type='date']").value,
            ssn: div.querySelectorAll("input[type='text']")[2].value,
        }));

        // Assign unique booking numbers
        const bookingNumberDeparture = `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const bookingNumberReturn = returningFlight
            ? `RET-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            : null;

        // Prepare booking summary
        const bookingSummary = {
            departingFlight: { ...departingFlight, bookingNumber: bookingNumberDeparture },
            returningFlight: returningFlight
                ? { ...returningFlight, bookingNumber: bookingNumberReturn }
                : null,
            passengers,
        };

        // Display booking summary
        displayBookingSummary(bookingSummary);

        // Save booking summary to JSON file (handled via backend)
        saveBookingSummary(bookingSummary);

        // Update available seats in XML file (handled via backend)
        updateSeatsInXML(departingFlight.id, returningFlight?.id, totalPassengers);

        alert("Booking confirmed!");
    });
});

function displayFlightDetails(flight, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <p><strong>Flight ID:</strong> ${flight.id}</p>
        <p><strong>Origin:</strong> ${flight.origin}</p>
        <p><strong>Destination:</strong> ${flight.destination}</p>
        <p><strong>Departure Date:</strong> ${flight.departureDate}</p>
        <p><strong>Arrival Date:</strong> ${flight.arrivalDate}</p>
        <p><strong>Departure Time:</strong> ${flight.departureTime}</p>
        <p><strong>Arrival Time:</strong> ${flight.arrivalTime}</p>
        <p><strong>Available Seats:</strong> ${flight.availableSeats}</p>
    `;
}

function calculateTotalPrice(departingFlight, returningFlight, adults, children, infants) {
    const adultPrice = (departingFlight?.price || 0) + (returningFlight?.price || 0);
    const childPrice = adultPrice * 0.7;
    const infantPrice = adultPrice * 0.1;
    return adults * adultPrice + children * childPrice + infants * infantPrice;
}

function displayBookingSummary(summary) {
    const summaryContainer = document.getElementById("summary-details");
    summaryContainer.innerHTML = "<h5>Booking Details:</h5>";

    const { departingFlight, returningFlight, passengers } = summary;

    summaryContainer.innerHTML += `
        <h6>Departing Flight:</h6>
        <p><strong>Booking Number:</strong> ${departingFlight.bookingNumber}</p>
        <p><strong>Flight ID:</strong> ${departingFlight.id}</p>
        <p><strong>Origin:</strong> ${departingFlight.origin}</p>
        <p><strong>Destination:</strong> ${departingFlight.destination}</p>
        <p><strong>Departure Date:</strong> ${departingFlight.departureDate}</p>
        <p><strong>Arrival Date:</strong> ${departingFlight.arrivalDate}</p>
    `;

    if (returningFlight) {
        summaryContainer.innerHTML += `
            <h6>Returning Flight:</h6>
            <p><strong>Booking Number:</strong> ${returningFlight.bookingNumber}</p>
            <p><strong>Flight ID:</strong> ${returningFlight.id}</p>
            <p><strong>Origin:</strong> ${returningFlight.origin}</p>
            <p><strong>Destination:</strong> ${returningFlight.destination}</p>
            <p><strong>Departure Date:</strong> ${returningFlight.departureDate}</p>
            <p><strong>Arrival Date:</strong> ${returningFlight.arrivalDate}</p>
        `;
    }

    summaryContainer.innerHTML += "<h6>Passengers:</h6>";
    passengers.forEach((passenger, index) => {
        summaryContainer.innerHTML += `
            <p><strong>Passenger ${index + 1}:</strong> ${passenger.firstName} ${passenger.lastName}</p>
            <p><strong>DOB:</strong> ${passenger.dob}</p>
            <p><strong>SSN:</strong> ${passenger.ssn}</p>
        `;
    });
}

function saveBookingSummary(summary) {
    fetch("saveBooking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
    }).catch((error) => console.error("Error saving booking summary:", error));
}

function updateSeatsInXML(departingFlightId, returningFlightId, totalPassengers) {
    fetch("updateSeats.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            departingFlightId,
            returningFlightId,
            totalPassengers,
        }),
    }).catch((error) => console.error("Error updating seats in XML:", error));
}

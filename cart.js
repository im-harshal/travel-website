document.addEventListener('DOMContentLoaded', () => {
  const dynamicContent = document.getElementById('dynamicContent');

  const departingFlight = JSON.parse(localStorage.getItem('departingFlight'));
  const returningFlight = JSON.parse(localStorage.getItem('returningFlight'));
  const passengerDetails = JSON.parse(localStorage.getItem('passengerDetails')) || { adults: 1, children: 0, infants: 0 };

  console.log('Passenger Details in Cart:', passengerDetails);

  let totalPrice = 0;

  function calculateTotalPrice(departingPrice, returningPrice, passengerDetails) {
    let total = 0;
    total += (passengerDetails.adults * (departingPrice + returningPrice));
    total += (passengerDetails.children * ((departingPrice * 0.7) + (returningPrice * 0.7)));
    total += (passengerDetails.infants * ((departingPrice * 0.1) + (returningPrice * 0.1)));
    return total;
  }

  function renderTable(title, flight, tableId) {
    const section = document.createElement('div');
    section.innerHTML = `
      <h2>${title}</h2>
      <table id="${tableId}">
        <thead>
          <tr>
            <th>Flight ID</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure Date</th>
            <th>Arrival Date</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Available Seats</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${flight ? `<tr>
            <td>${flight.flightId}</td>
            <td>${flight.origin}</td>
            <td>${flight.destination}</td>
            <td>${flight.departureDate}</td>
            <td>${flight.arrivalDate}</td>
            <td>${flight.departureTime}</td>
            <td>${flight.arrivalTime}</td>
            <td>${flight.availableSeats}</td>
            <td>$${flight.price}</td>
          </tr>` : `<tr><td colspan="9" style="text-align: center;">No flight selected</td></tr>`}
        </tbody>
      </table>
    `;
    dynamicContent.appendChild(section);
  }

  function renderPassengerForms(passengerDetails) {
    const formSection = document.createElement('div');
    formSection.innerHTML = '<h2>Passenger Details</h2>';
    let count = 0;

    Object.keys(passengerDetails).forEach(type => {
      for (let i = 0; i < passengerDetails[type]; i++) {
        const passengerForm = document.createElement('div');
        passengerForm.className = 'form-group highlight';
        passengerForm.innerHTML = `
          <h3>${type.slice(0, -1).toUpperCase()} ${++count}</h3>
          <label>First Name:</label>
          <input type="text" id="firstName${count}" required>
          <label>Last Name:</label>
          <input type="text" id="lastName${count}" required>
          <label>Date of Birth:</label>
          <input type="date" id="dob${count}" required>
          <label>SSN:</label>
          <input type="text" id="ssn${count}" required>
        `;
        formSection.appendChild(passengerForm);
      }
    });
    dynamicContent.appendChild(formSection);
  }

  function renderTotalPrice(total) {
    const priceSection = document.createElement('div');
    priceSection.innerHTML = `
      <h2>Total Price</h2>
      <p id="totalPrice">$${total}</p>
    `;
    dynamicContent.appendChild(priceSection);
  }

  function renderBookButton() {
    const buttonSection = document.createElement('div');
    buttonSection.innerHTML = `
      <button id="bookButton" class="btn">Book Flights</button>
      <p id="message" class="message"></p>
    `;
    dynamicContent.appendChild(buttonSection);

    document.getElementById('bookButton').addEventListener('click', () => {
      const message = document.getElementById('message');
      message.style.display = 'block';
      message.textContent = 'Booking flights...';

      const bookingDetails = {
        departingFlight,
        returningFlight,
        passengers: [],
        totalPrice,
      };

      let count = 0;
      Object.keys(passengerDetails).forEach(type => {
        for (let i = 0; i < passengerDetails[type]; i++) {
          bookingDetails.passengers.push({
            type: type.slice(0, -1),
            firstName: document.getElementById(`firstName${++count}`).value,
            lastName: document.getElementById(`lastName${count}`).value,
            dob: document.getElementById(`dob${count}`).value,
            ssn: document.getElementById(`ssn${count}`).value,
          });
        }
      });

      const generateBookingNumber = () => {
        return `BOOK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      };

      const departingBookingNumber = generateBookingNumber();
      const returningBookingNumber = generateBookingNumber();

      if (departingFlight) bookingDetails.departingFlight.bookingNumber = departingBookingNumber;
      if (returningFlight) bookingDetails.returningFlight.bookingNumber = returningBookingNumber;

      fetch("store_booking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save booking details.");
          }
          return response.json();
        })
        .then(() => {
          message.textContent = `Booking successful! Your booking numbers are ${departingBookingNumber}${returningFlight ? ` and ${returningBookingNumber}` : ''}.`;
          localStorage.clear();
        })
        .catch((error) => {
          message.textContent = `Error: ${error.message}`;
        });

      fetch("update_seats.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departingFlightId: departingFlight ? departingFlight.flightId : null,
          returningFlightId: returningFlight ? returningFlight.flightId : null,
          passengers: passengerDetails.adults + passengerDetails.children + passengerDetails.infants,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update seats in XML file.");
          }
          return response.json();
        })
        .then(() => {
          console.log("Seats updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating seats:", error);
        });
    });
  }

  if (departingFlight) {
    renderTable('Departing Flight', departingFlight, 'departingCartTable');
  }

  if (returningFlight) {
    renderTable('Returning Flight', returningFlight, 'returningCartTable');
  }

  totalPrice = calculateTotalPrice(
    departingFlight ? departingFlight.price : 0,
    returningFlight ? returningFlight.price : 0,
    passengerDetails
  );

  renderTotalPrice(totalPrice);
  renderPassengerForms(passengerDetails);
  renderBookButton();
});



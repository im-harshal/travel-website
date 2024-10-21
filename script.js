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
 *
 * Contact US - Form javascript
 *
 */
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const email = document.getElementById("email").value;
  const comment = document.getElementById("comment").value;

  // Regular expressions for validation
  const nameRegex = /^[A-Z][a-z]*$/;
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let isValid = true;
  let errorMessage = "";

  // First name validation
  if (!nameRegex.test(firstName)) {
    isValid = false;
    errorMessage +=
      "First name should start with a capital letter and contain only alphabets.\n";
  }

  // Last name validation
  if (!nameRegex.test(lastName)) {
    isValid = false;
    errorMessage +=
      "Last name should start with a capital letter and contain only alphabets.\n";
  }

  // First name and last name comparison
  if (firstName.toLowerCase() === lastName.toLowerCase()) {
    isValid = false;
    errorMessage += "First name and last name cannot be the same.\n";
  }

  // Phone number validation
  if (!phoneRegex.test(phoneNumber)) {
    isValid = false;
    errorMessage += "Phone number must be in the format (ddd) ddd-dddd.\n";
  }

  // Gender validation
  if (!gender) {
    isValid = false;
    errorMessage += "Please select a gender.\n";
  }

  // Email validation
  if (!emailRegex.test(email)) {
    isValid = false;
    errorMessage += "Please enter a valid email address.\n";
  }

  // Comment validation
  if (comment.length < 10) {
    isValid = false;
    errorMessage += "Comment must be at least 10 characters long.\n";
  }

  if (isValid) {
    alert("Form submitted successfully!");
    // You can add code here to submit the form data
  } else {
    alert("Please correct the following errors:\n\n" + errorMessage);
  }
});

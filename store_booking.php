<?php
// Read the input data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate the input data
if (!$data || empty($data['departingFlight']) || empty($data['passengers'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

// Store the booking details in a JSON file (or database)
$bookingFile = 'bookings.json';
$bookings = file_exists($bookingFile) ? json_decode(file_get_contents($bookingFile), true) : [];
$bookings[] = $data;

// Save the updated bookings
file_put_contents($bookingFile, json_encode($bookings, JSON_PRETTY_PRINT));

http_response_code(200);
echo json_encode(['message' => 'Booking saved successfully']);
?>


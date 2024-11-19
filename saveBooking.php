<?php
// File: saveBooking.php

header("Content-Type: application/json");

// Get incoming booking data
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['departingFlight'], $input['passengers'])) {
    echo json_encode(["error" => "Invalid booking data"]);
    exit;
}

// Prepare the booking data
$bookingData = [
    'departingFlight' => $input['departingFlight'],
    'returningFlight' => $input['returningFlight'] ?? null,
    'passengers' => $input['passengers']
];

// Save the booking data to a JSON file
$bookingsFile = 'bookings.json';
$existingBookings = [];

if (!file_exists($bookingsFile)) {
    file_put_contents($bookingsFile, json_encode([], JSON_PRETTY_PRINT));
}

if (file_exists($bookingsFile)) {
    $existingBookings = json_decode(file_get_contents($bookingsFile), true);
}

$existingBookings[] = $bookingData;

if (file_put_contents($bookingsFile, json_encode($existingBookings, JSON_PRETTY_PRINT))) {
    echo json_encode(["message" => "Booking saved successfully"]);
} else {
    echo json_encode(["error" => "Failed to save booking"]);
}
?>

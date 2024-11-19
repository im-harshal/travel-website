<?php
// File: flight.php

header("Content-Type: application/json");

// Get incoming data
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['origin'], $input['destination'], $input['date'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

// Load flight data from XML
$xmlFile = 'flight.xml';
if (!file_exists($xmlFile)) {
    echo json_encode(["error" => "Flights data not found"]);
    exit;
}

$xml = simplexml_load_file($xmlFile);
$origin = strtolower(trim($input['origin']));
$destination = strtolower(trim($input['destination']));
$departureDate = $input['date'];
$returnDate = $input['returnDate'] ?? null;
$passengers = $input['passengers'];

$departureResults = [];
$returnResults = [];

// Helper function to check date range
function isWithinDateRange($flightDate, $targetDate) {
    $flightTimestamp = strtotime($flightDate);
    $targetTimestamp = strtotime($targetDate);
    return abs($flightTimestamp - $targetTimestamp) <= 3 * 24 * 60 * 60; // 3 days in seconds
}

// Search for flights (departure or return)
function searchFlights($xml, $origin, $destination, $targetDate, $passengers) {
    $results = [];
    foreach ($xml->flight as $flight) {
        if (strtolower((string)$flight->origin) === $origin &&
            strtolower((string)$flight->destination) === $destination &&
            isWithinDateRange((string)$flight->{'departure-date'}, $targetDate) &&
            (int)$flight->{'available-seats'} >= $passengers) {

            $results[] = [
                'id' => (string)$flight->{'flight-id'},
                'origin' => (string)$flight->origin,
                'destination' => (string)$flight->destination,
                'departureDate' => (string)$flight->{'departure-date'},
                'arrivalDate' => (string)$flight->{'arrival-date'},
                'departureTime' => (string)$flight->{'departure-time'},
                'arrivalTime' => (string)$flight->{'arrival-time'},
                'availableSeats' => (int)$flight->{'available-seats'},
                'price' => (float)$flight->price
            ];
        }
    }
    return $results;
}

// Search for departing flights
$departureResults = searchFlights($xml, $origin, $destination, $departureDate, $passengers);

// Search for return flights if applicable
if ($returnDate) {
    $returnResults = searchFlights($xml, $destination, $origin, $returnDate, $passengers);
}

// Return the results
echo json_encode([
    'departure' => $departureResults,
    'return' => $returnResults
]);
?>



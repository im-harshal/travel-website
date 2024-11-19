<?php
// File: updateSeats.php

header("Content-Type: application/json");

// Get incoming data
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['departingFlightId'], $input['totalPassengers'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$departingFlightId = $input['departingFlightId'];
$returningFlightId = $input['returningFlightId'] ?? null;
$totalPassengers = $input['totalPassengers'];

// Load flight data from XML
$xmlFile = 'flight.xml';
if (!file_exists($xmlFile)) {
    echo json_encode(["error" => "Flight data file not found"]);
    exit;
}

$xml = simplexml_load_file($xmlFile);

function updateSeats($flightId, $totalPassengers, $xml) {
    foreach ($xml->flight as $flight) {
        if ((string)$flight->{'flight-id'} === $flightId) {
            $currentSeats = (int)$flight->{'available-seats'};
            if ($currentSeats >= $totalPassengers) {
                $flight->{'available-seats'} = $currentSeats - $totalPassengers;
                return true;
            } else {
                return false; // Not enough seats
            }
        }
    }
    return null; // Flight not found
}

$departureUpdated = updateSeats($departingFlightId, $totalPassengers, $xml);
$returnUpdated = $returningFlightId ? updateSeats($returningFlightId, $totalPassengers, $xml) : true;

if ($departureUpdated === false || $returnUpdated === false) {
    echo json_encode(["error" => "Not enough seats available"]);
    exit;
}

if ($departureUpdated === null || ($returningFlightId && $returnUpdated === null)) {
    echo json_encode(["error" => "Flight not found"]);
    exit;
}

// Save the updated XML
if ($xml->asXML($xmlFile)) {
    echo json_encode(["message" => "Seats updated successfully"]);
} else {
    echo json_encode(["error" => "Failed to update seats"]);
}
?>


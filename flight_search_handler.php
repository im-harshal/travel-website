<?php
header("Content-Type: application/json");

// Load flights data from XML file
$xml = simplexml_load_file('flights_data.xml');
if (!$xml) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to load flights data."]);
    exit;
}

// Function to find flights matching criteria
function findFlights($origin, $destination, $date, $passengers, $flexible = false) {
    global $xml;
    $results = [];
    $dateWindow = [$date];

    if ($flexible) {
        $requestedDate = strtotime($date);
        $dateWindow = [
            date('Y-m-d', strtotime('-3 days', $requestedDate)),
            date('Y-m-d', strtotime('-2 days', $requestedDate)),
            date('Y-m-d', strtotime('-1 day', $requestedDate)),
            $date,
            date('Y-m-d', strtotime('+1 day', $requestedDate)),
            date('Y-m-d', strtotime('+2 days', $requestedDate)),
            date('Y-m-d', strtotime('+3 days', $requestedDate))
        ];
    }

    foreach ($xml->flight as $flight) {
        $flightOrigin = strtolower((string)$flight->{'origin'});
        $flightDestination = strtolower((string)$flight->{'destination'});
        $flightDate = (string)$flight->{'departure-date'};
        $flightSeats = (int)$flight->{'available-seats'};

        if (
            $flightOrigin === strtolower($origin) &&
            $flightDestination === strtolower($destination) &&
            in_array($flightDate, $dateWindow) &&
            $flightSeats >= $passengers
        ) {
            $results[] = [
                "flightId" => (string)$flight->{'flight-id'},
                "origin" => (string)$flight->{'origin'},
                "destination" => (string)$flight->{'destination'},
                "departureDate" => (string)$flight->{'departure-date'},
                "arrivalDate" => (string)$flight->{'arrival-date'},
                "departureTime" => (string)$flight->{'departure-time'},
                "arrivalTime" => (string)$flight->{'arrival-time'},
                "availableSeats" => (int)$flight->{'available-seats'},
                "price" => (int)$flight->{'price'},
            ];
        }
    }

    return $results;
}

// Read the incoming request
$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['origin'], $input['destination'], $input['date'], $input['passengers'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input."]);
    exit;
}

$origin = $input['origin'];
$destination = $input['destination'];
$date = $input['date'];
$passengers = $input['passengers'];

// Find matching flights
$flights = findFlights($origin, $destination, $date, $passengers, true);

if (empty($flights)) {
    http_response_code(404);
    echo json_encode(["error" => "No flights available for the selected criteria."]);
    exit;
}

// Return matching flights
http_response_code(200);
echo json_encode(["flights" => $flights]);
?>


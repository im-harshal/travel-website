<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $hotel_id = $_POST['hotel_id'];
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $adults = $_POST['adults'];
    $children = $_POST['children'];
    $infants = $_POST['infants'];

    // Load the hotels data
    $hotels_file = '../data/hotels.json';
    $hotels = json_decode(file_get_contents($hotels_file), true);

    // Find the selected hotel
    $selected_hotel_key = array_search($hotel_id, array_column($hotels, 'hotel_id'));
    if ($selected_hotel_key === false) {
        echo json_encode(['error' => 'Hotel not found.']);
        exit;
    }

    $selected_hotel = $hotels[$selected_hotel_key];

    // Check if there are enough rooms available
    if ($selected_hotel['rooms'] <= 0) {
        echo json_encode(['error' => 'No rooms available for this hotel.']);
        exit;
    }

    // Calculate total price
    $nights = (strtotime($check_out) - strtotime($check_in)) / 86400;
    $total_price = $nights * $selected_hotel['price_per_night'];

    // Update the number of available rooms in hotels.json
    $hotels[$selected_hotel_key]['rooms'] -= 1;
    file_put_contents($hotels_file, json_encode($hotels, JSON_PRETTY_PRINT));

    // Store booking information in booking.xml
    $booking_file = '../data/bookings.xml';

    // Create a new DOMDocument or load the existing one
    if (file_exists($booking_file)) {
        $xml = new DOMDocument();
        $xml->load($booking_file);
        $root = $xml->documentElement;
    } else {
        $xml = new DOMDocument('1.0', 'UTF-8');
        $root = $xml->createElement('bookings');
        $xml->appendChild($root);
    }

    // Create a booking element
    $booking = $xml->createElement('booking');

    $booking->appendChild($xml->createElement('hotel_name', $selected_hotel['hotel_name']));
    $booking->appendChild($xml->createElement('city', $selected_hotel['city']));
    $booking->appendChild($xml->createElement('check_in', $check_in));
    $booking->appendChild($xml->createElement('check_out', $check_out));
    $booking->appendChild($xml->createElement('adults', $adults));
    $booking->appendChild($xml->createElement('children', $children));
    $booking->appendChild($xml->createElement('infants', $infants));
    $booking->appendChild($xml->createElement('total_price', $total_price));

    $root->appendChild($booking);

    // Save the updated XML file
    $xml->formatOutput = true;
    $xml->save($booking_file);

    // Send response to the client
    $response = [
        'hotel_name' => $selected_hotel['hotel_name'],
        'city' => $selected_hotel['city'],
        'check_in' => $check_in,
        'check_out' => $check_out,
        'adults' => $adults,
        'children' => $children,
        'infants' => $infants,
        'total_price' => $total_price,
    ];

    echo json_encode($response);
    exit;
}
?>

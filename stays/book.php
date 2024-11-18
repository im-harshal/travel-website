<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $hotel_id = $_POST['hotel_id'];
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $adults = $_POST['adults'];
    $children = $_POST['children'];
    $infants = $_POST['infants'];

    $hotels = json_decode(file_get_contents('../data/hotels.json'), true);
    $selected_hotel = array_filter($hotels, function ($hotel) use ($hotel_id) {
        return $hotel['hotel_id'] == $hotel_id;
    });
    $selected_hotel = reset($selected_hotel);

    $nights = (strtotime($check_out) - strtotime($check_in)) / 86400;
    $total_price = $nights * $selected_hotel['price_per_night'];

    // Pass booking details to cart.html via query parameters
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

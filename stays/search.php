<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $city = strtolower(trim($_POST['city']));
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $adults = intval($_POST['adults']);
    $children = intval($_POST['children']);
    $infants = intval($_POST['infants']);

    // Validate inputs
    $valid_cities = ['austin', 'houston', 'dallas', 'san antonio', 'fort worth', 'los angeles', 'san francisco', 'san diego', 'sacramento', 'san jose'];
    $min_date = '2024-09-01';
    $max_date = '2024-12-01';

    $errors = [];
    if (!in_array($city, $valid_cities)) {
        $errors[] = "City must be in Texas or California.";
    }

    if ($check_in < $min_date || $check_out > $max_date || $check_in >= $check_out) {
        $errors[] = "Check-in and check-out dates must be between September 1 and December 1, 2024.";
    }

    if ($adults < 1 || $adults > 2) {
        $errors[] = "Maximum 2 adults per room.";
    }

    if ($children > 2) {
        $errors[] = "Maximum 2 children per room.";
    }

    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color: red;'>$error</p>";
        }
        exit;
    }

    // Load hotels data
    $hotels = json_decode(file_get_contents('../data/hotels.json'), true);
    $available_hotels = array_filter($hotels, function ($hotel) use ($city) {
        return $hotel['city'] === ucfirst($city) && $hotel['rooms'] > 0;
    });

    // Display available hotels
    echo "<h1>Available Hotels</h1>";
    if (!empty($available_hotels)) {
        echo "<ul>";
        foreach ($available_hotels as $hotel) {
            echo "
                <li>
                    <form id='bookForm' novalidate>
                        {$hotel['hotel_name']} in {$hotel['city']} - $ {$hotel['price_per_night']} per night
                        <input type='hidden' name='hotel_id' value='{$hotel['hotel_id']}'>
                        <input type='hidden' name='check_in' value='$check_in'>
                        <input type='hidden' name='check_out' value='$check_out'>
                        <input type='hidden' name='adults' value='$adults'>
                        <input type='hidden' name='children' value='$children'>
                        <input type='hidden' name='infants' value='$infants'>
                        <button type='submit'>Book</button>
                    </form>
                </li>
            ";
        }
        echo "</ul>";
    } else {
        echo "<p>No hotels available in $city for the selected dates.</p>";
    }
}
?>

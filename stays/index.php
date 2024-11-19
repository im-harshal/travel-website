<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stays Page</title>
    <link rel="stylesheet" href="../css/mystyle.css">
</head>
<body>
    <h1>Find Your Stay</h1>
    <form id="staysForm" action="search.php" method="POST">
        <label for="city">City:</label>
        <input type="text" id="city" name="city" required>

        <label for="check_in">Check-In Date:</label>
        <input type="date" id="check_in" name="check_in" required>

        <label for="check_out">Check-Out Date:</label>
        <input type="date" id="check_out" name="check_out" required>

        <label for="adults">Number of Adults:</label>
        <input type="number" id="adults" name="adults" min="1" max="2" required>

        <label for="children">Number of Children:</label>
        <input type="number" id="children" name="children" min="0" max="2" required>

        <label for="infants">Number of Infants:</label>
        <input type="number" id="infants" name="infants" min="0">

        <button type="submit">Search</button>
    </form>
</body>
</html>

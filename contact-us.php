<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve form data
    $firstName = htmlspecialchars($_POST['firstName']);
    $lastName = htmlspecialchars($_POST['lastName']);
    $phone = htmlspecialchars($_POST['phone']);
    $gender = htmlspecialchars($_POST['gender']);
    $email = htmlspecialchars($_POST['email']);
    $comment = htmlspecialchars($_POST['comment']);

    // Path to the XML file
    $filePath = "contact-info.xml";

    // Create a new XML document or load existing one
    if (file_exists($filePath)) {
        $xml = simplexml_load_file($filePath);
    } else {
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><conatct-info></contact-info>');
    }

    // Add a new submission
    $submission = $xml->addChild("submission");
    $submission->addChild("firstName", $firstName);
    $submission->addChild("lastName", $lastName);
    $submission->addChild("phone", $phone);
    $submission->addChild("gender", $gender);
    $submission->addChild("email", $email);
    $submission->addChild("comment", $comment);

    // Save the XML document
    $xml->asXML($filePath);

    // Respond to the client
    echo json_encode(["success" => true, "message" => "Form data saved successfully!"]);
    exit;
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

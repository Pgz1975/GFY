<?php
// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Rate limiting (prevent spam)
session_start();
$current_time = time();
$timeout = 60; // 60 seconds between submissions

if (isset($_SESSION['last_submission_time']) && 
    ($current_time - $_SESSION['last_submission_time']) < $timeout) {
    http_response_code(429);
    die("Please wait a minute before sending another message");
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $interest = $_POST['interest'] ?? '';
    $message = $_POST['message'] ?? '';
    
    // Validate inputs
    if (empty($name) || strlen($name) < 2) {
        http_response_code(400);
        die("Name must be at least 2 characters long");
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        die("Please enter a valid email address");
    }

    if (empty($message) || strlen($message) < 10) {
        http_response_code(400);
        die("Message must be at least 10 characters long");
    }

    // Validate interest selection
    $valid_interests = ['b2c', 'b2b', 'partnership', 'nonprofit'];
    if (empty($interest) || !in_array($interest, $valid_interests)) {
        http_response_code(400);
        die("Please select a valid interest");
    }
    
    // Prepare email
    $to = "contact@greenfinity.academy";
    $subject = "New Contact Form Submission - $interest";
    
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Interest: $interest\n\n";
    $email_content .= "Message:\n$message";
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Additional spam prevention
    if (preg_match('/[\\x00-\\x1F\\x7F-\\xFF]/', $name . $email . $message)) {
        http_response_code(400);
        die("Invalid characters detected");
    }

    // Send email
    if (mail($to, $subject, $email_content, $headers)) {
        $_SESSION['last_submission_time'] = $current_time;
        header("Location: index.html?status=success#contact");
        exit();
    } else {
        error_log("Failed to send email from {$email}");
        http_response_code(500);
        die("Failed to send email. Please try again later or contact us directly at contact@greenfinity.academy");
    }
} else {
    // Not a POST request
    http_response_code(405);
    die("Method not allowed");
}
?>

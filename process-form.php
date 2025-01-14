<?php
// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $interest = $_POST['interest'] ?? '';
    $message = $_POST['message'] ?? '';
    
    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        die("Please fill all required fields");
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        die("Invalid email format");
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
    
    // Send email
    if (mail($to, $subject, $email_content, $headers)) {
        // Redirect back to the form with success message
        header("Location: index.html?status=success#contact");
        exit();
    } else {
        http_response_code(500);
        die("Failed to send email");
    }
} else {
    // Not a POST request
    http_response_code(405);
    die("Method not allowed");
}
?>

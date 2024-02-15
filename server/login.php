<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connection.php';
include './vendor/autoload.php'; // Include the autoloader for JWT
use Firebase\JWT\JWT;

// Your secret key for encoding and decoding JWTs
$secret_key = "your_secret_key";
$token_duration = 3600; // Token expiration time in seconds (1 hour)

// Set headers after starting the session
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$username = $data->userName;
$password = $data->userPass;

$sql = "SELECT * FROM user_login WHERE username = '$username' AND password = '$password'";
$result = $connection->query($sql);

if ($result->num_rows == 1) {

    $token_payload = array(
        "username" => $username,
        "exp" => time() + $token_duration
    );
    $token = JWT::encode($token_payload, $secret_key, 'HS256');
    // Send the token as a response
    echo json_encode(array("token" => $token, "message" => "Success"));

} else {
    echo json_encode(array("message" => "Failed"));
}


?>



<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connection.php';
include './vendor/autoload.php'; // Include the autoloader for JWT
use Firebase\JWT\JWT;

// Your secret key for encoding and decoding JWTs
$secret_key = 'your_secret_key';
$token_duration = 18000; // Token expiration time in seconds (1 hour) = 3600

// Set headers after starting the session
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$username = $data->userName;
$password = $data->userPass;

$sql = "SELECT * FROM user_login WHERE username = '$username' AND password = '$password'";
$result = $connection->query($sql);

if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $id = $row['id'];
    $name = $row['first_name'];
    $role = $row['role'];

    $token_payload = [
        'username' => $username,
        'exp' => time() + $token_duration,
    ];
    $token = JWT::encode($token_payload, $secret_key, 'HS256');
    // Send the token as a response
    echo json_encode([
        'token' => $token,
        'message' => 'Success',
        'id' => $id,
        'name' => $name,
        'role' => $role,
    ]);
} else {
    echo json_encode(['message' => 'Failed']);
}
?>



<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


// $servername = "localhost";
// $username = "root";
// $password = "";
// $database = "nerdb";

$servername = "sql312.infinityfree.com";
$username = "epiz_34199524";
$password = "EgnZzU8tEcC";
$database = "epiz_34199524_admin";


// Create a database connection
$connection = new mysqli($servername, $username, $password, $database);

// Check the connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}
// else{
//     echo 'success';
// }


?>
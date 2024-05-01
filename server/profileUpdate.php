<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->userID;
$firstName = $data->firstName;
$lastName = $data->lastName;
$userEmail = $data->userEmail;
$userName = $data->userName;

$sql = 'UPDATE user_login SET first_name=?, last_name=?, email=?, username=? WHERE id=?';
$stmt = $connection->prepare($sql);
$stmt->bind_param('ssssi', $firstName, $lastName, $userEmail, $userName, $id);
$stmt->execute();

if ($stmt->errno) {
    die('ERROR EXECUTING: ' . $stmt->error);
} else {
    echo 'SUCCESS';
}

$stmt->close();
$connection->close();
?>

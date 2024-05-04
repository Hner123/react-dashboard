<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$staffUserID = $data->staffUserID;
$staffName = $data->staffName;
$staffLastName = $data->staffLastName;
$staffUserName = $data->staffUserName;
$staffUserpass = $data->staffUserpass;

$sqlQuery = 'UPDATE user_login SET first_name=?, last_name=?, username=?, password=? WHERE id=?';

$stmt = $connection->prepare($sqlQuery);
$stmt->bind_param('ssssi', $staffName, $staffLastName, $staffUserName, $staffUserpass, $staffUserID);

if ($stmt->execute()) {
    echo 'success';
}
$stmt->close();
$connection->close();
?>



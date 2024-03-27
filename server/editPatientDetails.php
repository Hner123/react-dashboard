<?php
include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$patientName = $data->patientName;
$patientLastname = $data->patientLastname;
$patientGender = $data->patientGender;
$patientAddress = $data->patientAddress;
$patientPhone = $data->patientPhone;
$patientEmail = $data->patientEmail;
$patientDOB = $data->patientDOB;

$sql = $connection->prepare("UPDATE customer_details SET Fname=?, Sname=?, DateOfBirth=?, Address=?, emailAdd=?, phoneNum=?, Gender=? WHERE id=?");
$sql->bind_param("sssssssi", $patientName, $patientLastname, $patientDOB, $patientAddress, $patientEmail, $patientPhone, $patientGender, $id);
$sql->execute();

if ($sql->errno) {
    die("SQL error: " . $sql->error);
} else {
    echo "SUCCESS";
}

$sql->close();
$connection->close();
?>

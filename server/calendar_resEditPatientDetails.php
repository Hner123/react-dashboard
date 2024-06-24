<?php include 'connection.php';
header('Content-Type:application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$name = $data->name;
$lastname = $data->lastname;
$email = $data->email;
$phoneNumber = $data->phoneNumber;

try {
    $sqlPatientList = 'UPDATE booking_table SET First_Name=?, Last_Name=?, Email=?, Phon_Num=? WHERE id=?';
    $stmt = $connection->prepare($sqlPatientList);
    $stmt->bind_param('sssii', $name, $lastname, $email, $phoneNumber, $id);
    if ($stmt->execute()) {
        echo 'success';
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['Error' => $e->getMessage()]);
}

?>

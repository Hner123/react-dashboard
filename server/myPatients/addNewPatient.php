<?php include '../connection.php';
header('Content-Type:application/json');

try {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    $name = $data->name;
    $lastName = $data->lastName;
    $address = $data->address;
    $email = $data->email;
    $gender = $data->gender;
    $number = $data->number;
    $DOB = $data->DOB;

    $sqlAdd = 'INSERT INTO customer_details SET Fname=?, Sname=?, DateOfBirth=?, Address=?, emailAdd=?, phoneNum=?, Gender=?';
    $stmt = $connection->prepare($sqlAdd);
    $stmt->bind_param('sssssis', $name, $lastName, $DOB, $address, $email, $number, $gender);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

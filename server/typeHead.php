<?php include 'connection.php';

$sql = 'SELECT * FROM customer_details';
$result = $connection->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $response = [
        'id' => $row['id'],
        'name' => $row['Fname'] . ' ' . $row['Sname'],
        'first_name' => $row['Fname'],
        'last_name' => $row['Sname'],
        'email_address' => $row['emailAdd'],
        'phone_number' => $row['phoneNum'],
    ];
    $data[] = $response;
}

$jsonOutput = [
    'Patients' => $data,
];

header('Content-Type: application/json');
echo json_encode($jsonOutput);

$connection->close();

?>

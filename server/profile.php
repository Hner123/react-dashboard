<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->userID;

$sql = 'SELECT * FROM user_login WHERE id=?';
$stmt = $connection->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $response = [
        'id' => $row['id'],
        'name' => $row['first_name'],
        'lastname' => $row['last_name'],
        'username' => $row['username'],
        'email' => $row['email'],
    ];
    $data[] = $response;
}
$stmt->close();

$staff = 'staff';
$sql2 = 'SELECT * FROM user_login WHERE role=?';
$stmt2 = $connection->prepare($sql2);
$stmt2->bind_param('s', $staff);
$stmt2->execute();
$result2 = $stmt2->get_result();

$staffData = [];
while ($row = $result2->fetch_assoc()) {
    $response = [
        'id' => $row['id'],
        'name' => $row['first_name'],
        'lastname' => $row['last_name'],
        'username' => $row['username'],
        'email' => $row['email'],
    ];
    $staffData[] = $response;
}

$jsonOutput = [
    'user_Accounts' => $data,
    'staff_Accounts' => $staffData,
];

header('Content-Type: application/json');
echo json_encode($jsonOutput);

$connection->close();
?>

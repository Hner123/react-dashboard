<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
// $id = 65;

$sql = "SELECT * FROM customer_details WHERE id=$id";
$result = $connection->query($sql);

$sql_patient_history = "SELECT * FROM historyforcustomerdetails WHERE user_id=$id";
$result_patient_history = $connection->query($sql_patient_history);

$sql_patient_file = "SELECT * FROM customer_file_data WHERE user_id=$id";
$result_patient_file = $connection->query($sql_patient_file);

$patientData = [];
if (!$result) {
    die('Invalied query : ' . $connection->error);
}

$patient_history = [];
if (!$result_patient_history) {
    die('Invalied query : ' . $connection->error);
}

$patient_attachement_file = [];
if (!$result_patient_file) {
    die('Invalied query : ' . $connection->error);
}

while ($row = $result->fetch_assoc()) {
    $fetchData = [
        $row['id'],
        $row['Fname'],
        $row['Sname'],
        $row['DateOfBirth'],
        $row['Address'],
        $row['emailAdd'],
        $row['phoneNum'],
        $row['Gender'],
        $row['CustomerNotes'],
        $row['profile_image'],
        $row['TimeStamp'],
    ];

    $patientData[] = $fetchData;
}

while ($row = $result_patient_history->fetch_assoc()) {
    $fetchData = [
        $row['user_id'],
        $row['Procedures'],
        $row['Payment_Cost'],
        $row['timestamp'],
        $row['notes'],
    ];

    $patient_history[] = $fetchData;
}

while ($row = $result_patient_file->fetch_assoc()) {
    $convertedKB = 0;
    if ($row['file_size'] >= 1048576) {
        $convertedKB = round($row['file_size'] / 1048576, 1) . 'mb';
    } elseif ($row['file_size'] > 1024) {
        $convertedKB = round($row['file_size'] / 1024, 1) . 'kb';
    } else {
        $convertedKB = $row['file_size'] . 'b';
    }

    $fetchData = [
        $row['file_name'],
        $convertedKB, // $row['file_size']
        $row['file_data'],
        $row['id'],
    ];

    $patient_attachement_file[] = $fetchData;
}

$response = [
    'patientData' => $patientData,
    'patient_history' => $patient_history,
    'patient_attachement_file' => $patient_attachement_file,
];

header('Content-Type: application/json');
echo json_encode($response);

$connection->close();

?>

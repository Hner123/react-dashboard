<?php include 'connection.php';
header('Content-Type:application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$firstName = $data->firstName;
$lastName = $data->lastName;
$emailAdd = $data->emailAdd;
$phoneNum = $data->phoneNum;
$selectedBranch = $data->selectedBranch;
$service = $data->service;
$serviceDuration = $data->serviceDuration;

$patientStatus = 'old';
$date = $data->date;
$dateParts = explode('-', $date);
$year = $dateParts[0];
$month = $dateParts[1] - 1;
$day = $dateParts[2];

$time = $data->time;
$notes = $data->notes;
$statsColor = '#FFB64D';

try {
    $sqlQuery = "INSERT INTO booking_table (book_Year, book_Month, book_Day, book_Time, First_Name, 
Last_Name, Email, Phon_Num, Patient_Status, Patient_Note, location, service, duration, statsColor)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    $stmt = $connection->prepare($sqlQuery);
    $stmt->bind_param(
        'iiissssissssss',
        $year,
        $month,
        $day,
        $time,
        $firstName,
        $lastName,
        $emailAdd,
        $phoneNum,
        $patientStatus,
        $notes,
        $selectedBranch,
        $service,
        $serviceDuration,
        $statsColor
    );
    if ($stmt->execute()) {
        echo 'success';
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$stmt->close();
$connection->close();
?>

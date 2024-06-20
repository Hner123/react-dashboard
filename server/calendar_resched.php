<?php include 'connection.php';
header('Content-Type:application/json');
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$selectedBranch = $data->selectedBranch;
$service = $data->service;

$date = $data->date;
$dateParts = explode('-', $date);
$year = $dateParts[0];
$month = $dateParts[1] - 1;
$day = $dateParts[2];

$time = $data->time;

try {
    $serviceDuration = $data->serviceDuration;

    $sqlQuery = 'UPDATE booking_table SET location=?, service=?, book_Year=?, book_Month=?, book_Day=?, book_Time=?, duration=? WHERE id = ?';

    $stmt = $connection->prepare($sqlQuery);
    if (!$stmt) {
        die('Error preparing statement: ' . $connection->error);
    }
    $stmt->bind_param('ssiiissi', $selectedBranch, $service, $year, $month, $day, $time, $serviceDuration, $id);

    if ($stmt->execute()) {
        echo 'Record successfully updated!.';
    } else {
        die('Error executing..' . $stmt->error);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

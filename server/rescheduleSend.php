<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$currentYear = $data->currentYear;
$currentMonth = $data->currentMonth;
$daySelect = $data->daySelect;
$timeSelect = date('H:i', strtotime($data->timeSelect));

$sqlQuery = 'UPDATE confirmed_booking SET book_Year=?, book_Month=?, book_Day=?, book_Time=? WHERE id=?';
$stmt = $connection->prepare($sqlQuery);
$stmt->bind_param('iiisi', $currentYear, $currentMonth, $daySelect, $timeSelect, $id);
$stmt->execute();

if ($stmt->errno) {
    die('ERROR EXECUTING: ' . $stmt->error);
} else {
    echo 'SUCCESS';
}

$stmt->close();
$connection->close();
?>

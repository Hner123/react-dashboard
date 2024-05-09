<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);
date_default_timezone_set('Asia/Manila');
$selectedDate = strtotime($data->selectedDate);

$year = date('Y', $selectedDate);
$month = date('m', $selectedDate) - 1;
$day = date('d', $selectedDate);

$branchLocation = $data->branchLocation;
$remarks = $data->remarks;

$sqlQuery = "INSERT INTO list_holiday (book_Year, book_Month, book_Day, day_Remarks, location)
VALUES (?,?,?,?,?)";

$stmt = $connection->prepare($sqlQuery);
$stmt->bind_param('iiiss', $year, $month, $day, $remarks, $branchLocation);

if ($stmt->execute()) {
    echo 'success';
} else {
    echo 'Error: ' . $stmt->error;
}

$stmt->close();
$connection->close();

?>

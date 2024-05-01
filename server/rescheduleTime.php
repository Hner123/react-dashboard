<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$yearDate = $data->currentYear;
$monthDate = $data->currentMonth;
$dateDate = $data->number;

// $yearDate = 2024;
// $monthDate = 5;
// $dateDate = 15;

$sqlQuery = 'SELECT * FROM confirmed_booking WHERE book_Year=? AND book_Month=? AND book_Day=?';
$stmt = $connection->prepare($sqlQuery);
$stmt->bind_param('iii', $yearDate, $monthDate, $dateDate);
$stmt->execute();

$result = $stmt->get_result();

$jsonResponse = [];
while ($row = $result->fetch_assoc()) {
    $data = [date('h:i A', strtotime($row['book_Time']))];
    $jsonResponse[] = $data;
}

$response = [
    'List' => $jsonResponse,
];

header('Content-Type: application/json');
echo json_encode($response);

$stmt->close();
$connection->close();
?>

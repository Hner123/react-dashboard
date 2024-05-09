<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$location = $data->userLocation;

$sqlQuery = "SELECT * FROM list_holiday WHERE location='$location'";
$result_holiday = $connection->query($sqlQuery);

$holidayList = [];
while ($row = $result_holiday->fetch_assoc()) {
    $response = [
        'id' => $row['id'],
        'Year' => $row['book_Year'],
        'Month' => $row['book_Month'],
        'Day' => $row['book_Day'],
    ];
    $holidayList[] = $response;
}

$responseData = [
    'holiday' => $holidayList,
];

header('Content-Type: application/json');
echo json_encode($responseData);

$connection->close();
?>

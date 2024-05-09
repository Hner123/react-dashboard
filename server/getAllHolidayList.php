<?php include 'connection.php';

$sqlQuery = 'SELECT * FROM list_holiday';
$result = $connection->query($sqlQuery);

$holidayList = [];
while ($row = $result->fetch_assoc()) {
    $response = [
        'id' => $row['id'],
        'Year' => $row['book_Year'],
        'Month' => $row['book_Month'],
        'Day' => $row['book_Day'],
        'Remarks' => $row['day_Remarks'],
        'Branch' => $row['location'],
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

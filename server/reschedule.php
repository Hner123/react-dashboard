<?php include 'connection.php';

$sqlQuery = 'SELECT * FROM confirmed_booking';
$result = $connection->query($sqlQuery);

if (!$result) {
    die('Invalied query : ' . $connection->error);
}

$resultArray = [];
$countDate = [];
while ($row = $result->fetch_assoc()) {
    $dateBook = $row['book_Year'] . '-' . $row['book_Month'] . '-' . $row['book_Day'];

    if (isset($countDate[$dateBook])) {
        $countDate[$dateBook] += 1;
    } else {
        // If not, create a new entry in the array
        $countDate[$dateBook] = 1;
    }

    $data = [
        'Year : ' => $row['book_Year'],
        'Month : ' => $row['book_Month'],
        'Day : ' => $row['book_Day'],
        'Time : ' => $row['book_Time'],
        'SameDayCount : ' => $countDate[$dateBook],
    ];
    $resultArray[] = $data;
}

$dateCounts = [];
foreach ($countDate as $date => $count) {
    // Deconstruct the date string
    list($year, $month, $day) = explode('-', $date);

    $dateCounts[] = [
        'Year' => $year,
        'Month' => (int) $month, // Convert to integer
        'Day' => $day,
        'SameDayCount' => $count,
    ];
}

$response = [
    'countDay' => $countDate,
    'disableDay' => $dateCounts,
    // 'Booking_Details' => $resultArray,
];

header('Content-Type: application/json');
echo json_encode($response);

?>

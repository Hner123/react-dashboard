<?php include 'connection.php';
header('Content-Type: application/json');
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$selectedYear = $data->dateSelected;
$dateParts = explode('-', $selectedYear);
$year = $dateParts[0];
$month = $dateParts[1] - 1;
$day = $dateParts[2];
$selectedBranch = $data->selectedBranch;

// $year = 2024;
// $month = 05;
// $day = 16;
// $selectedBranch = 'Marikina';

try {
    $sqlQuery = 'SELECT * FROM confirmed_booking WHERE book_Year=? AND book_Month=? AND book_Day=? AND location=?
            UNION
            SELECT * FROM booking_table WHERE book_Year=? AND book_Month=? AND book_Day=?  AND location=?';

    $stmt = $connection->prepare($sqlQuery);
    $stmt->bind_param('iiisiiis', $year, $month, $day, $selectedBranch, $year, $month, $day, $selectedBranch);

    $stmt->execute();
    $result = $stmt->get_result();

    $jsonResponse = [];
    while ($row = $result->fetch_assoc()) {
        $response = [
            'start' => $row['book_Time'],
            'duration' => $row['duration'],
        ];
        $jsonResponse[] = $response;
    }

    echo json_encode($jsonResponse);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getmessage()]);
}

$stmt->close();
$connection->close();
?>

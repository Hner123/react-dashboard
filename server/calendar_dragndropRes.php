<?php include 'connection.php';
header('Content-Type:application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;

$date = $data->date;
$dateParts = explode('-', $date);
$year = $dateParts[0];
$month = $dateParts[1] - 1;
$day = $dateParts[2];

$time = $data->time;
$duration = $data->duration;

try {
    $sqlQuery = 'UPDATE booking_table SET book_Year=?, book_Month=?, book_Day=?, book_Time=?, duration=? WHERE id=?';
    $stmt = $connection->prepare($sqlQuery);
    if (!$stmt) {
        die('Error preparing statement: ' . $connection->error);
    }
    $stmt->bind_param('iiissi', $year, $month, $day, $time, $duration, $id);
    if ($stmt->execute()) {
        echo 'Record successfully updated!.';
    } else {
        die('Error executing..' . $stmt->error);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error:' => $e->getMessage()]);
}

?>

<?php include 'connection.php';
header('Content-Type:application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$name = $data->name;

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

        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $dateTimeStamp = new DateTime($TimeStamp);
        $formattedDate = $dateTimeStamp->format('M j, Y g:i a');

        $sched = new DateTime($date);
        $formattedSched = $sched->format('M j');

        $time12HourFormat = date('h:i A', strtotime($time));

        $feed_title = 'Appointment Updated';
        $feed_info = 'Appointment with ' . strtoupper($name) . ' on ' . $formattedSched . ' at ' . $time12HourFormat . ' has been updated.';

        $sql_feed = 'INSERT INTO activity_feed (feed_title, feed_info, TimeStamp) VALUES (?,?,?)';
        $stmt_feed = $connection->prepare($sql_feed);
        $stmt_feed->bind_param('sss', $feed_title, $feed_info, $formattedDate);

        if ($stmt_feed->execute()) {
            echo 'saved resched feed info';
        }
        $stmt_feed->close();
    } else {
        die('Error executing..' . $stmt->error);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error:' => $e->getMessage()]);
}

?>

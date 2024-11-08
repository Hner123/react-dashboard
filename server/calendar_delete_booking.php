<?php
include 'connection.php';
header('Content-Type:application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$nameP = $data->nameP;
$dateStart = $data->dateStart;
$timeS = $data->timeS;

try {
    $delete_query = 'DELETE FROM booking_table WHERE id=?';
    $stmt = $connection->prepare($delete_query);
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo 'Deleted';

        $time12HourFormat = date('h:i A', strtotime($timeS));
        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $date = new DateTime($TimeStamp);
        $formattedDate = $date->format('M j, Y g:i a');

        $sched = new DateTime($dateStart);
        $formattedSched = $sched->format('M j');

        $feed_title = 'Appointment Cancelled';
        $feed_info = 'Appointment with ' . strtoupper($nameP) . ' on ' . $formattedSched . ' at ' . $time12HourFormat . ' has been cancelled.';

        $sql_feed = 'INSERT INTO activity_feed (feed_title, feed_info, TimeStamp) VALUES (?,?,?)';
        $stmt_feed = $connection->prepare($sql_feed);
        $stmt_feed->bind_param('sss', $feed_title, $feed_info, $formattedDate);

        if ($stmt_feed->execute()) {
            echo 'saved cancelled feed info';
        }
        $stmt_feed->close();
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$stmt->close();
$connection->close();
?>

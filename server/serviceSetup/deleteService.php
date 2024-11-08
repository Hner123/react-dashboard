<?php include '../connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->deleteID;
$serviceName = $data->serviceName;

try {
    $sqlDelete = 'DELETE FROM services_list WHERE id=?';
    $stmt = $connection->prepare($sqlDelete);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $dateTimeStamp = new DateTime($TimeStamp);
        $formattedDate = $dateTimeStamp->format('M j, Y g:i a');

        $feed_title = 'Service Deleted';
        $feed_info = $serviceName . ' has been deleted.';

        $sql_feed = 'INSERT INTO activity_feed (feed_title, feed_info, TimeStamp) VALUES (?,?,?)';
        $stmt_feed = $connection->prepare($sql_feed);
        $stmt_feed->bind_param('sss', $feed_title, $feed_info, $formattedDate);

        if ($stmt_feed->execute()) {
            echo json_encode(['message' => 'success']);
        }
        $stmt_feed->close();
    }
    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

<?php include '../connection.php';
header('Content-Type:application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$service = $data->service;
$duration = $data->duration;
$categoryID = $data->categoryID;

try {
    $sql = 'INSERT INTO services_list SET serviceName=?, serviceDuration=?, category_name_id=?';
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('ssi', $service, $duration, $categoryID);

    if ($stmt->execute()) {
        // echo 'success';

        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $dateTimeStamp = new DateTime($TimeStamp);
        $formattedDate = $dateTimeStamp->format('M j, Y g:i a');

        $feed_title = 'Service Created';
        $feed_info = $service . ' has been added.';

        $sql_feed = 'INSERT INTO activity_feed (feed_title, feed_info, TimeStamp) VALUES (?,?,?)';
        $stmt_feed = $connection->prepare($sql_feed);
        $stmt_feed->bind_param('sss', $feed_title, $feed_info, $formattedDate);

        if ($stmt_feed->execute()) {
            echo 'success';
        }
        $stmt_feed->close();
    }
    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

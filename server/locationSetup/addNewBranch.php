<?php include '../connection.php';
header('Content-Type:application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

try {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    $branch = $data->branch;
    $location = $data->location;

    $sql = 'INSERT INTO branch_list SET branch_name=?, branch_address=?';
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('ss', $branch, $location);
    if ($stmt->execute()) {
        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $dateTimeStamp = new DateTime($TimeStamp);
        $formattedDate = $dateTimeStamp->format('M j, Y g:i a');

        $feed_title = 'Location Created';
        $feed_info = $branch . ' has been added.';

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
    echo json_encode(['Error' => $e->getMessage()]);
}

?>

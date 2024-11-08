<?php include '../connection.php';
header('Content-Type:application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

try {
    //code...
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    $id = $data->id;
    $branchName = $data->branchName;
    $location = $data->location;

    $sqlEdit = 'UPDATE branch_list SET branch_name=?, branch_address=? WHERE id=?';
    $stmt = $connection->prepare($sqlEdit);
    $stmt->bind_param('ssi', $branchName, $location, $id);
    if ($stmt->execute()) {
        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $dateTimeStamp = new DateTime($TimeStamp);
        $formattedDate = $dateTimeStamp->format('M j, Y g:i a');

        $feed_title = 'Location Updated';
        $feed_info = $branchName . ' has been updated.';

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
    echo json_encode(['error' => $e->getMessag()]);
}

?>

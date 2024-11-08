<?php include 'connection.php';

header('Content-Type:application/json');

try {
    date_default_timezone_set('Asia/Manila');
    $TimeStamp = date('Y-m-d h:i:s');

    $sql_query = 'SELECT * FROM activity_feed';
    $stmt = $connection->prepare($sql_query);

    if ($stmt->execute()) {
        $result = $stmt->get_result();

        $response = [];
        while ($row = $result->fetch_assoc()) {
            $data = [
                'id' => $row['id'],
                'feed_title' => $row['feed_title'],
                'feed_info' => $row['feed_info'],
                'feed_timeStamp' => $row['TimeStamp'],
            ];
            $response[] = $data;
        }
        echo json_encode($response);
    }
} catch (Exception $e) {
    echo json_encode(['error ' => $e->getMessage()]);
}

?>

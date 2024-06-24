<?php include 'connection.php';
header('Content-Type:application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$status = $data->status;

try {
    $sqlQuery = 'UPDATE booking_table SET statsColor=? WHERE id=?';
    $stmt = $connection->prepare($sqlQuery);
    if (!$stmt) {
        die('Error connecting database: ' . $connection->error);
    }
    $stmt->bind_param('si', $status, $id);

    if ($stmt->execute()) {
        echo 'successfully change statsColor';
    } else {
        echo 'error executing stmt : ' . $stmt->error;
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

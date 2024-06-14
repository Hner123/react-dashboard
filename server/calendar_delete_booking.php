<?php include 'connection.php';

header('Content-Type: application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;

try {
    $delete_query = 'DELETE FROM booking_table WHERE id=?';
    $stmt = $connection->prepare($delete_query);
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo 'Deleted';
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$stmt->close();
$connection->close();

?>

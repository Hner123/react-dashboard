<?php include '../connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;

try {
    $sqlDelete = 'DELETE FROM services_category WHERE id=?';
    $stmt = $connection->prepare($sqlDelete);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }
    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

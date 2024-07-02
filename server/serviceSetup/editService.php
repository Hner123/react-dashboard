<?php include '../connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$service = $data->service;
$duration = $data->duration;

try {
    $sqlEdit = 'UPDATE services_list SET serviceName=?, serviceDuration=? WHERE id=?';
    $stmt = $connection->prepare($sqlEdit);
    $stmt->bind_param('ssi', $service, $duration, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

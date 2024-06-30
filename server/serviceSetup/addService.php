<?php include '../connection.php';
header('Content-Type:application/json');

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
        echo 'success';
    }
    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

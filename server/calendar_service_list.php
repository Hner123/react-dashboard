<?php include 'connection.php';

header('Content-Type:application/json');

try {
    $sqlQuery = 'SELECT * FROM services_list';
    $stmt = $connection->prepare($sqlQuery);
    $stmt->execute();

    $result = $stmt->get_result();

    $response = [];
    while ($row = $result->fetch_assoc()) {
        $data = [
            'id' => $row['id'],
            'service_name' => $row['serviceName'],
            'service_duration' => $row['serviceDuration'],
        ];
        $response[] = $data;
    }
    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$stmt->close();
$connection->close();
?>

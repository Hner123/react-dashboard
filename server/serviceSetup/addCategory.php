<?php include '../connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$category = $data->category;

try {
    $sqlAdd = 'INSERT INTO services_category (category_name) VALUES (?)';
    $stmt = $connection->prepare($sqlAdd);
    $stmt->bind_param('s', $category);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

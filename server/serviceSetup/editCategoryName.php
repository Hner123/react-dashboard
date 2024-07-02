<?php include '../connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$categoryID = $data->categoryID;
$categoryN = $data->categoryN;

try {
    $sqlEdit = 'UPDATE services_category SET category_name=? WHERE id=?';
    $stmt = $connection->prepare($sqlEdit);
    $stmt->bind_param('si', $categoryN, $categoryID);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

<?php include '../connection.php';
header('Content-Type:application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$idSelected = $data->selected;

try {
    // Construct the SQL query with placeholders
    $placeholders = implode(',', array_fill(0, count($idSelected), '?'));
    $sqlDelete = "DELETE FROM customer_details WHERE id IN ($placeholders)";

    $stmt = $connection->prepare($sqlDelete);

    // Dynamically bind the parameters
    $types = str_repeat('i', count($idSelected));
    $stmt->bind_param($types, ...$idSelected);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    } else {
        echo json_encode(['error' => 'Failed to delete records']);
    }

    $stmt->close();
    $connection->close();
    //code...
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

<?php include '../connection.php';
header('Content-Type:application/json');

try {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    $id = $data->id;

    $sqlDelete = 'DELETE FROM branch_list WHERE id=?';
    $stmt = $connection->prepare($sqlDelete);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['Error' => $e->getMessage()]);
}

?>

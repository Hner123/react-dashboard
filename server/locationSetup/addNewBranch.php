<?php include '../connection.php';
header('Content-Type:application/json');

try {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    $branch = $data->branch;
    $location = $data->location;

    $sql = 'INSERT INTO branch_list SET branch_name=?, branch_address=?';
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('ss', $branch, $location);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['Error' => $e->getMessage()]);
}

?>

<?php include '../connection.php';
header('Content-Type:application/json');

try {
    //code...
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    $id = $data->id;
    $branchName = $data->branchName;
    $location = $data->location;

    $sqlEdit = 'UPDATE branch_list SET branch_name=?, branch_address=? WHERE id=?';
    $stmt = $connection->prepare($sqlEdit);
    $stmt->bind_param('ssi', $branchName, $location, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'success']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessag()]);
}

?>

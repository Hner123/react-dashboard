<?php include 'connection.php';
header('Content-Type:application/json');

try {
    $sqlQuery = 'SELECT * FROM branch_list';
    $stmt = $connection->prepare($sqlQuery);
    $stmt->execute();
    $result = $stmt->get_result();

    $response = [];
    while ($row = $result->fetch_assoc()) {
        $data = [
            'id' => $row['id'],
            'branchName' => $row['branch_name'],
            'location' => $row['branch_address'],
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

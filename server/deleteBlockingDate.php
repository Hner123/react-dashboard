<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;

$sqlQuery = 'DELETE FROM list_holiday WHERE id=?';
$stmt = $connection->prepare($sqlQuery);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo 'success deletion';
} else {
    echo 'error deleting' . $stmt->error;
}

$stmt->close();
$connection->close();
?>

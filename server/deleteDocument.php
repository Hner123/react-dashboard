<?php include 'connection.php';

$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData);


$id = $data->deleteID;

$sql = "DELETE FROM customer_file_data WHERE id=?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

if ($stmt->error) {
    die("SQL error: " . $stmt->error);
    } else {
    echo "SUCCESS";
    }

$stmt->close();
$connection->close();

?>
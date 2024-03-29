<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;


$sql = "DELETE FROM `customer_details` WHERE id=?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id);
$result = $stmt->execute();

if(!$result){
    die("Error sql query :" . $stmt->error);
}
else{
    echo "Delete Success";
}


$stmt->close();
$connection->close();

?>
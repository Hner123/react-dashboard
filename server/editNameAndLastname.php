<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->firstRowData;
$name = trim($data->name);
$lastname = trim($data->lastname);

if($id && $name && $lastname){

    $sql = "UPDATE confirmed_booking SET First_Name=?, Last_Name=? WHERE id=?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("ssi", $name, $lastname, $id);
   

    if( $stmt->execute() === TRUE){
        echo "Updated Name and Lastname";
    }
    else{
        die("sql error :" . $stmt->error);
    }

}
$stmt->close();
$connection->close();
?>
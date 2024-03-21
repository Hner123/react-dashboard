<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->firstRowData;
$name = trim(mysqli_real_escape_string($connection, $data->name));
$lastname = trim(mysqli_real_escape_string($connection, $data->lastname));

if($id){

    $sql = "UPDATE `confirmed_booking` SET First_Name = '$name', Last_Name = '$lastname' WHERE id = '$id'";
    if($connection->query($sql) === TRUE){
        echo "Record edited successfully.";
    }
    else{
        echo "ERROR edit record : " . $connection->error; 
    }

}

$connection->close();
?>
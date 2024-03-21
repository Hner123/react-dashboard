<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->firstRowData;

$history_data = "";

$sql = "SELECT * FROM cancelled_booking WHERE id=$id";
$result = $connection->query($sql);
if(!$result)
{
    die("Invalid query: ".$connection->error);
}  

while($row = $result->fetch_assoc()){
    $history_data .= $row['book_Year'] . "-" .  $row['book_Month'] . "-" .  $row['book_Day'] .
    "-" .  $row['book_Time'] . " , " .  $row['First_Name'] . " , " .  $row['Last_Name'] .
    " , " .  $row['Email'] . " , " .  $row['Date_of_Birth'] . " , " .  $row['Phon_Num'] .
    " , " .  $row['Patient_Status'] . " , " .  $row['Patient_Note'] . " , " .  $row['location'] .
    " , " .  $row['service'] . " , " .  $row['reason_cancelled'] ."<br>";
}

$deleted_from = "cancelled page";
$insert_history_data = "INSERT INTO history_details (history_details, Deleted_From)
VALUES ('$history_data' , '$deleted_from')";

if($connection->query($insert_history_data) === TRUE){
    echo "Inserted history successfully.";

    $delete_query = "DELETE FROM cancelled_booking WHERE id=$id";
    if($connection->query($delete_query) === TRUE){
        echo "Deleted successfully.";
    }
    else {
        echo "Error deleting source rows: " . $connection->error;
    }
}







?>
<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);
date_default_timezone_set('Asia/Manila');

$id = $data->firstRowData;
$userID = $data->userID;
$procedure = trim(mysqli_real_escape_string($connection, $data->procedure));
$paymentCost = trim(mysqli_real_escape_string($connection, $data->paymentCost));

$sql = "SELECT * FROM confirmed_booking WHERE id=$id";
$result2 = $connection->query($sql);

$history_message ="";


if($userID != null || $userID != 0){
    $insertQuery = "INSERT INTO historyforcustomerdetails (user_id, Procedures, Payment_Cost) 
    VALUES ('$userID', '$procedure', '$paymentCost')";
    $result = $connection->query($insertQuery);
    if(!$result)
    {
        die("Invalid query: ".$connection->error);
    }
    else{
        echo "SUCCESS!";

        while ($row = $result2->fetch_assoc()) {
            $history_message .= $row['book_Year'] . "-" .  $row['book_Month'] . "-" .  $row['book_Day'] .
            "-" .  $row['book_Time'] . " , " .  $row['First_Name'] . " , " .  $row['Last_Name'] .
            " , " .  $row['Email'] . " , " .  $row['Date_of_Birth'] . " , " .  $row['Phon_Num'] .
            " , " .  $row['Patient_Status'] . " , " .  $row['Patient_Note'] . "<br>";
        }

        $deletedFrom = "From Confirm Page";
        $history_details_query = "INSERT INTO history_details (history_details, Deleted_From) 
        VALUES ('$history_message', '$deletedFrom')";

        if ($connection->query($history_details_query) === TRUE) {
            echo "Inserted to history successfully.";

            $delete_query = "DELETE FROM confirmed_booking WHERE id = $id";
            if ($connection->query($delete_query) === TRUE) {
                echo "Deleted successfully.";
            } else {
                echo "Error deleting source rows: " . $connection->error;
            }

        } else {
        echo "Error inserting source rows: " . $connection->error;
        }


    }
}







$connection->close();
?>
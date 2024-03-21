<?php include 'connection.php';
// Database connection details

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->firstRowData;
$reason_cancelled = mysqli_real_escape_string($connection, $data->reasons);

// SQL query to select data from source table
$select_query = "SELECT * FROM booking_table WHERE id = $id";

// Execute select query
$result = $connection->query($select_query);

// Check if there are rows to transfer
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    $insert_query = "INSERT INTO cancelled_booking 
    (`book_Year`, `book_Month`, `book_Day`, `book_Time`, `First_Name`, `Last_Name`, `Email`, `Date_of_Birth`, 
    `Phon_Num`, `Patient_Status`, `Patient_Note`, `location` , `service` , `reason_cancelled`) 
    VALUES (
        '{$row['book_Year']}', '{$row['book_Month']}', '{$row['book_Day']}', '{$row['book_Time']}', 
        '{$row['First_Name']}', '{$row['Last_Name']}', '{$row['Email']}', '{$row['Date_of_Birth']}', 
        '{$row['Phon_Num']}', '{$row['Patient_Status']}', '{$row['Patient_Note']}', '{$row['location']}'
        , '{$row['service']}' , '{$reason_cancelled}'
    )";

    // Execute insert query
    if ($connection->query($insert_query) === TRUE) {
        echo "Data transfer successful!";

        // If the data transfer is successful, delete the rows from the source table
        $delete_query = "DELETE FROM booking_table WHERE id = $id";

        if ($connection->query($delete_query) === TRUE) {
            echo "Source rows deleted successfully.";
        } else {
            echo "Error deleting source rows: " . $connection->error;
        }
    } else {
        echo "Error transferring data: " . $connection->error;
    }
}

// Close the database connection
$connection->close();
?>

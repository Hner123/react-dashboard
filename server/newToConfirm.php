<?php include 'connection.php';


$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->firstRowData;

// SQL query to select data from source table
$select_query = "SELECT * FROM booking_table WHERE id = $id";

// Execute select query
$result = $connection->query($select_query);

// Check if there are rows to transfer
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // SQL query to insert data into destination table
    $insert_query = "INSERT INTO confirmed_booking 
    (`book_Year`, `book_Month`, `book_Day`, `book_Time`, `First_Name`, `Last_Name`, `Email`, `Phon_Num`, `Patient_Status`, `Patient_Note`, `location`, `service`) 
    VALUES (
        '{$row['book_Year']}', '{$row['book_Month']}', '{$row['book_Day']}', '{$row['book_Time']}', 
        '{$row['First_Name']}', '{$row['Last_Name']}', '{$row['Email']}', 
        '{$row['Phon_Num']}', '{$row['Patient_Status']}', '{$row['Patient_Note']}', '{$row['location']}', '{$row['service']}'
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

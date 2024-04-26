<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

// date_default_timezone_set('Asia/Manila');

$id = $data->firstRowData;
$userID = $data->userID;
$procedure = trim($data->procedure);
$paymentCost = trim($data->paymentCost);
$notes = trim($data->notes);

$sql = 'SELECT * FROM confirmed_booking WHERE id=?';
$stmt = $connection->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$result2 = $stmt->get_result();
$stmt->close();

$history_message = '';

if ($userID != null || $userID != 0) {
    $insertQuery = "INSERT INTO historyforcustomerdetails (user_id, Procedures, payment_Cost, notes)
    VALUES (?,?,?,?)";
    $stmt2 = $connection->prepare($insertQuery);
    $stmt2->bind_param('isis', $userID, $procedure, $paymentCost, $notes);
    $result = $stmt2->execute();

    if (!$result) {
        die('Invalid query: ' . $stmt2->error);
    } else {
        echo 'SUCCESS!';
        $stmt2->close();
        while ($row = $result2->fetch_assoc()) {
            $history_message .=
                $row['book_Year'] .
                '-' .
                $row['book_Month'] .
                '-' .
                $row['book_Day'] .
                '-' .
                $row['book_Time'] .
                ' , ' .
                $row['First_Name'] .
                ' , ' .
                $row['Last_Name'] .
                ' , ' .
                $row['Email'] .
                ' , ' .
                $row['Date_of_Birth'] .
                ' , ' .
                $row['Phon_Num'] .
                ' , ' .
                $row['Patient_Status'] .
                ' , ' .
                $row['Patient_Note'] .
                '<br>';
        }

        $deletedFrom = 'From Confirm Page, transacted';

        $history_details_query = "INSERT INTO history_details (history_details, Deleted_From)
        VALUES (?,?)";
        $stmt3 = $connection->prepare($history_details_query);
        $stmt3->bind_param('ss', $history_message, $deletedFrom);

        if ($stmt3->execute() === true) {
            $stmt3->close();
            echo 'Inserted to history successfully.';

            $delete_query = 'DELETE FROM confirmed_booking WHERE id=?';
            $stmt4 = $connection->prepare($delete_query);
            $stmt4->bind_param('i', $id);

            if ($stmt4->execute() === true) {
                $stmt4->close();
                echo 'Deleted successfully.';
            } else {
                echo 'Error deleting source rows: ' . $stmt4->error;
            }
        } else {
            echo 'Error inserting source rows: ' . $connection->error;
        }
    }
}

$connection->close();
?>

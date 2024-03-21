<?php include 'connection.php';



$sql = "SELECT * FROM confirmed_booking";
$result = $connection->query($sql);

$DateAndName = array();
while ($row = $result->fetch_assoc()) {
    $bookingDate = $row['book_Year'] . "-" . $row['book_Month'] + 1 . "-" . $row['book_Day'];
    $bookingName = $row['First_Name'] . " " . $row['Last_Name'];
    $bookTime =  $row['book_Time'];
    
    
    $twelveHourTime = date("h:i A", strtotime($bookTime));

    $data = array(
        $row['id'],
        date('Y-m-d', strtotime($bookingDate)) ." " . "($twelveHourTime)",
        $bookingName,
        $row['Email'],
        $row['Phon_Num'],
        $row['Patient_Status'],
        $row['service'],
        $row['location'],
        $row['Patient_Note'],
        $row['Patient_Note']

        
    );


    $DateAndName[] = $data;

}
    $responseData = array(
        'DateAndName' => $DateAndName,
    
    );
    
        // Send the data as JSON
        header('Content-Type: application/json');
        echo json_encode($responseData);

        $connection->close();

?>
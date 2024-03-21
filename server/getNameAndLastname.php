<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id_num;


// *************************************FETCH ID, NAME and LASTNAME**********************************************
if($id){
    $select_query = "SELECT * FROM confirmed_booking WHERE id = $id";
    $result = $connection->query($select_query);
    if(!$result)
    {
        die("Invalid query: ".$connection->error);
    } 
    
    if ($result->num_rows > 0) {
    
        $row = $result->fetch_assoc();
        $id = $row['id'];
        $name = $row['First_Name'];
        $lastname = $row['Last_Name'];
    
    }
    
    $responseData = array(
        'ID' => $id,
        'First_Name' => $name,
        'Last_Name' => $lastname,
        );
    
    header('Content-Type: application/json');
    echo json_encode($responseData);

   
}

$connection->close();
?>
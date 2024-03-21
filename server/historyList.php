<?php include 'connection.php';

$sql = "SELECT * FROM history_details";
$result = $connection->query($sql);
if(!$result)
{
    die("Invalid query: ".$connection->error);
}  

$history_data = array();
while($row = $result->fetch_assoc()){

    $data = array(
        $row['id'],
        $row['history_details'],
        $row['Deleted_From'],
        $row['history_created']
       
    );

    $history_data[] = $data;
}

$responseData = array(
    'history_data' => $history_data,
);

header('Content-Type: application/json');
echo json_encode($responseData);

  $connection->close();
?>
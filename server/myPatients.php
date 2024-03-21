<?php include 'connection.php';

$sql = "SELECT * FROM customer_details";
$result = $connection->query($sql);
if(!$result)
{
    die("Invalid query: ".$connection->error);
}  


$myPatients = array();
while($row = $result->fetch_assoc()){

    $data = array(
        $row['id'],
        $fullname =   $row['Fname'] . " " .   $row['Sname'],
        $row['Address'],
        $row['phoneNum'],
        $row['Gender'],
        $row['TimeStamp'],
        $row['TimeStamp']
    );

    $myPatients[] = $data;
}

$response = array(
    'myPatients' => $myPatients,
);

header('Content-Type: application/json');
echo json_encode($response);


$connection ->close();

?>
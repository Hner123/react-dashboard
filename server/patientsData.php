<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
// $id = 65;

$sql = "SELECT * FROM customer_details WHERE id=$id";
$result = $connection->query($sql);

$sql_patient_history = "SELECT * FROM historyforcustomerdetails WHERE user_id=$id";
$result_patient_history = $connection->query($sql_patient_history);


$patientData = array();
if(!$result){
    die("Invalied query : " . $connection->error );
}

$patient_history = array();
if(!$result_patient_history){
    die("Invalied query : " . $connection->error );
}

while($row = $result->fetch_assoc()){

    $fetchData = array(
        $row['id'],
        $row['Fname'],
        $row['Sname'],
        $row['DateOfBirth'],
        $row['Address'],
        $row['emailAdd'],
        $row['phoneNum'],
        $row['Gender'],
        $row['CustomerNotes'],
        $row['TimeStamp']
    );

    $patientData[] = $fetchData;
}

while($row = $result_patient_history->fetch_assoc()){

    $fetchData = array(
        $row['user_id'],
        $row['Procedures'],
        $row['Payment_Cost'],
        $row['timestamp']
    );

    $patient_history[] = $fetchData;
}

$response = array(
    'patientData' => $patientData,
    'patient_history' => $patient_history
);




header('Content-Type: application/json');
echo json_encode($response);


$connection ->close();

?>
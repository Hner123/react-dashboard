<?php include 'connection.php';


$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id_num;
// $id = 3369;

$select_query = "SELECT * FROM confirmed_booking WHERE id = $id";
// Execute select query
$result = $connection->query($select_query);
if(!$result)
{
    die("Invalid query: ".$connection->error);
}  
$name = "";
$lastname = "";
$id;

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();
    $id = $row['id'];
    $name = $row['First_Name'];
    $lastname = $row['Last_Name'];

}

$Select_user = "SELECT * FROM customer_details WHERE Fname = '$name' AND Sname = '$lastname'";
$result2 = $connection->query($Select_user);
if(!$result2)
{
    die("Invalid query: ".$connection->error);
}  
$userFound = "";
$userId = "";
if ($result2->num_rows > 0) {
    $userFound = "User found!";
}
else{
    $userFound = "User not found!";
}
while ($row2 = $result2->fetch_assoc()) {
    $userId = $row2['id'];
}

$responseData = array(
    'ID' => $id,
    'First_Name' => $name,
    'Last_Name' => $lastname,
    'UserFound' => $userFound,
    'User_ID' => $userId
    );

header('Content-Type: application/json');
echo json_encode($responseData);

$connection->close();
?>
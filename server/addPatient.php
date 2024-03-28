<?php include 'connection.php';

$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData);

$name = $data->name;
$lastName = $data->lastName;
$address = $data->address;
$email = $data->email;
$gender = $data->gender;
$number = $data->number;
$birth = $data->birth;

date_default_timezone_set('Asia/Manila');
$TimeStamp = date('Y-m-d h:i:s');


$sql = "INSERT INTO customer_details (Fname, Sname, DateOfBirth, Address, emailAdd, phoneNum, Gender, TimeStamp)
VALUES (?,?,?,?,?,?,?,?)";
$stmt = $connection->prepare($sql);
$stmt->bind_param("sssssiss", $name, $lastName, $birth, $address, $email, $number, $gender, $TimeStamp);
$result = $stmt->execute();

if(!$result){
    die("Invalid query :" . $stmt->error);
}
else{
    echo "Success";
}

$stmt->close();
$connection->close();

?>

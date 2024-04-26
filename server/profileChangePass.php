<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->userID;
$currentPassword = $data->userCurrentPass;
$newPassword = $data->userNewPass;

$sql = "SELECT * FROM user_login WHERE id=?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$row = $result->fetch_assoc();
$DB_password = $row['password'];

if($currentPassword === $DB_password){
    $sql_changeP = "UPDATE user_login SET password=? WHERE id=?";
    $stmt_changeP = $connection->prepare($sql_changeP);
    $stmt_changeP->bind_param("si", $newPassword, $id);
    $stmt_changeP->execute();

    echo "Password Changed";
}
else{
    echo "Incorrect";
}

$connection->close();
?>


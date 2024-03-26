<?php include 'connection.php';

$id = isset($_POST['id']) ? $_POST['id'] : null;
// $profilePic = 'asdasd'; // Set a default value
if (isset($_FILES['addFile'])) {
    $file = $_FILES['addFile'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileError = $file['error'];
    $fileSize = $file['size'];
    $fileParts = explode('.', $fileName);
    $fileExt = strtolower(end($fileParts));

    if ($fileError === 0) { // 5MB limit
        $newFileName = $fileName. "_" . $id . "_" . time() . "." . $fileExt; // Unique file name
        $destination = 'image/' . $newFileName;
        move_uploaded_file($fileTmpName, $destination);
        $document = $newFileName;
    }
}


$sql = $connection->prepare("INSERT INTO customer_file_data (user_id, file_name, file_data, file_type, file_size) VALUES (?, ?, ?, ?, ?)");
$sql->bind_param("isssi", $id, $fileName, $document, $fileExt, $fileSize);
$sql->execute();

if ($sql->errno) {
    die("SQL error: " . $sql->error);
} else {
    echo "SUCCESS";
}

$sql->close();
$connection->close();

?>
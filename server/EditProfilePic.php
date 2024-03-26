<?php include 'connection.php';

$id = isset($_POST['id']) ? $_POST['id'] : null;
// $profilePic = 'asdasd'; // Set a default value
if (isset($_FILES['profilePic'])) {
    $file = $_FILES['profilePic'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileError = $file['error'];
    $fileSize = $file['size'];
    $fileParts = explode('.', $fileName);
    $fileExt = strtolower(end($fileParts));

    $allowed = array('jpg', 'jpeg', 'png', 'gif', 'webp');

    if ($fileError === 0 && in_array($fileExt, $allowed)) { // 5MB limit
        $newFileName = "profile_" . $id . "_" . time() . "." . $fileExt; // Unique file name
        $destination = 'image/' . $newFileName;
        move_uploaded_file($fileTmpName, $destination);
        $profilePic = $newFileName;
    }
}

$sql = $connection->prepare("UPDATE customer_details SET profile_image=? WHERE id=?");
$sql->bind_param("si", $profilePic, $id);
$sql->execute();

if ($sql->errno) {
    die("SQL error: " . $sql->error);
} else {
    echo "SUCCESS";
}

$sql->close();
$connection->close();

?>
<?php
include 'connection.php';

// Get JSON data from request
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

// Extract data from JSON
$id = mysqli_real_escape_string($connection, $data->id);
$notes = mysqli_real_escape_string($connection, $data->clientNotes);

if($id && $notes){

$sql = "UPDATE `customer_details` SET CustomerNotes = '$notes' WHERE id = '$id'";
$result = $connection->query($sql);

if (!$result) {
    die("CONNECTION SQL QUERY INVALID : " . $connection->error);
} else {
    echo "Success";
}
}

$connection->close();
?>

















<!-- 
// Validate and handle file upload for profilePic separately
$profilePic = ''; // Set a default value
if (isset($_FILES['profilePic'])) {
    $file = $_FILES['profilePic'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileError = $file['error'];
    $fileSize = $file['size'];
    $fileParts = explode('.', $fileName);
    $fileExt = strtolower(end($fileParts));

    $allowed = array('jpg', 'jpeg', 'png', 'gif');

    if ($fileError === 0 && in_array($fileExt, $allowed)) { // 5MB limit
        $newFileName = "profile_" . $id . "_" . time() . "." . $fileExt; // Unique file name
        $destination = 'image/' . $newFileName;
        move_uploaded_file($fileTmpName, $destination);
        $profilePic = $newFileName;
    }
}


// Use prepared statements for database interaction
$stmt = $connection->prepare("UPDATE customer_details SET CustomerNotes=?, profile_image=? WHERE id=?");
$stmt->bind_param("ssi", $notes, $profilePic, $id);
$result = $stmt->execute();

if (!$result) {
    die("Invalid query: " . $stmt->error);
} else {
    echo "Successfully updated!";
}

$stmt->close(); -->
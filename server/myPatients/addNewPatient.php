<?php include '../connection.php';
header('Content-Type:application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

try {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData);

    $name = $data->name;
    $lastName = $data->lastName;
    $address = $data->address;
    $email = $data->email;
    $gender = $data->gender;
    $number = $data->number;
    $DOB = $data->DOB;

    $sqlAdd = 'INSERT INTO customer_details SET Fname=?, Sname=?, DateOfBirth=?, Address=?, emailAdd=?, phoneNum=?, Gender=?';
    $stmt = $connection->prepare($sqlAdd);
    $stmt->bind_param('sssssis', $name, $lastName, $DOB, $address, $email, $number, $gender);
    if ($stmt->execute()) {
        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $dateTimeStamp = new DateTime($TimeStamp);
        $formattedDate = $dateTimeStamp->format('M j, Y g:i a');

        $feed_title = 'Created New Customer';
        $feed_info = $name . ' ' . $lastName . ' has been created.';

        $sql_feed = 'INSERT INTO activity_feed (feed_title, feed_info, TimeStamp) VALUES (?,?,?)';
        $stmt_feed = $connection->prepare($sql_feed);
        $stmt_feed->bind_param('sss', $feed_title, $feed_info, $formattedDate);

        if ($stmt_feed->execute()) {
            echo json_encode(['message' => 'success']);
        }
        $stmt_feed->close();
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

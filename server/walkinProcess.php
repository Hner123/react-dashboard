<?php include 'connection.php';

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$id = $data->id;
$procedure = trim($data->procedure);
$paymentCost = trim($data->paymentCost);
$notes = trim($data->notes);

$insertQuery = "INSERT INTO historyforcustomerdetails (user_id, Procedures, payment_Cost, notes)
VALUES (?,?,?,?)";
$stmt2 = $connection->prepare($insertQuery);
$stmt2->bind_param('isss', $id, $procedure, $paymentCost, $notes);
$result = $stmt2->execute();

if (!$result) {
    die('Invalid query: ' . $stmt2->error);
} else {
    echo 'SUCCESS!';
    $stmt2->close();

    $history_message = 'Walk-in';
    $deletedFrom = 'WALKING in';

    $history_details_query = "INSERT INTO history_details (history_details, Deleted_From)
    VALUES (?,?)";
    $stmt3 = $connection->prepare($history_details_query);
    $stmt3->bind_param('ss', $history_message, $deletedFrom);
    $result2 = $stmt3->execute();
    if (!$result) {
        echo 'Error saving history' . $stmt3->error;
    } else {
        echo 'SUCCESS saving history!';
    }
}

$stmt->close();
$connection->close();
?>

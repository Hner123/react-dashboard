<?php
include 'connection.php';
header('Content-Type: application/json');

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$name = $data->name;
$lastName = $data->lastName;
$servicesP = $data->servicesP;
$price = $data->price;
$assisted = $data->assisted;
$notes = $data->notes;
$id = $data->id;

try {
    $sqlQuery = 'SELECT * FROM customer_details';
    $stmt = $connection->prepare($sqlQuery);
    $stmt->execute();
    $result = $stmt->get_result();

    $sqlHistory = "INSERT INTO historyforcustomerdetails (user_id, Procedures, Payment_Cost, assisted_by, notes) 
    VALUES (?,?,?,?,?)";
    $stmtHistory = $connection->prepare($sqlHistory);

    $userFound = false; // Flag to check if user exists

    while ($row = $result->fetch_assoc()) {
        if (strtolower(trim($row['Fname'])) === strtolower(trim($name)) && strtolower(trim($row['Sname'])) === strtolower(trim($lastName))) {
            $stmtHistory->bind_param('isiss', $row['id'], $servicesP, $price, $assisted, $notes);
            if ($stmtHistory->execute()) {
                $statsColor = '#B0B0B0';
                $sqlBookingList = 'UPDATE booking_table SET statsColor=? WHERE id=?';
                $stmtBookingList = $connection->prepare($sqlBookingList);
                $stmtBookingList->bind_param('si', $statsColor, $id);
                if (!$stmtBookingList->execute()) {
                    throw new Exception('Error inserting history: ' . $stmtBookingList->error);
                }
                echo json_encode(['message' => 'Existed']);
            } else {
                throw new Exception('Error inserting history: ' . $stmtHistory->error);
            }
            $stmtHistory->close();
            $userFound = true;
            break;
        }
    }

    if (!$userFound) {
        echo json_encode(['message' => 'Did not exist']);
    }

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

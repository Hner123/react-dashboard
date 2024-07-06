<?php include '../connection.php';
header('Content-Type:application/json');

try {
    $sql = 'SELECT * FROM customer_details';
    $stmt = $connection->prepare($sql);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 0;
    $patientList = [];
    while ($row = $result->fetch_assoc()) {
        $data = [
            'id' => $row['id'],
            'name' => $row['Fname'] . ' ' . $row['Sname'],
            'email' => $row['emailAdd'],
            'address' => $row['Address'],
            'phoneNumber' => $row['phoneNum'],
            'gender' => $row['Gender'],
            'notes' => $row['CustomerNotes'],
            'dateCreated' => $row['TimeStamp'],
        ];
        $count += 1;
        $patientList[] = $data;
    }

    $response = [
        'totalPatient' => $count,
        'patientList' => $patientList,
    ];
    echo json_encode($response);

    $stmt->close();
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>

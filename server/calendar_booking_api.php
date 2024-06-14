<?php include 'connection.php';

header('Content-Type: application/json');

$sqlQuery = 'SELECT * FROM booking_table WHERE location=?';
$Marikina = 'Marikina';

try {
    $stmt = $connection->prepare($sqlQuery);
    $stmt->bind_param('s', $Marikina);
    $stmt->execute();

    $result = $stmt->get_result();
    $response = [];
    while ($row = $result->fetch_assoc()) {
        $dateFormat = $row['book_Year'] . '-' . $row['book_Month'] + 1 . '-' . $row['book_Day'];

        if (strpos($row['duration'], 'hr') !== false) {
            $interval = new DateInterval('PT' . (int) $row['duration'] . 'H');
        } elseif (strpos($row['duration'], 'mins') !== false) {
            $interval = new DateInterval('PT' . (int) $row['duration'] . 'M');
        }

        $addTimeDuration = new DateTime($row['book_Time']);
        $addTimeDuration->add($interval);

        $data = [
            'id' => $row['id'],
            'title' => $row['First_Name'] . ' ' . $row['Last_Name'],
            'start' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $row['book_Time'],
            'end' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $addTimeDuration->format('H:i'),
            'email' => $row['Email'],
            'phoneNum' => $row['Phon_Num'],
            'services' => $row['service'],
            'notes' => $row['Patient_Note'],
            'timeStart' => $row['book_Time'],
            'durationP' => $row['duration'],
            'status' => $row['Patient_Status'],
            'backgroundColor' => '#ffb64d',
        ];
        $response[] = $data;
    }

    $stmt->close();
    $connection->close();

    $responseArray = [
        'Marikina' => $response,
    ];

    echo json_encode($responseArray);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

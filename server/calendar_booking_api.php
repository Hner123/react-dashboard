<?php include 'connection.php';

header('Content-Type: application/json');

function parseDuration($duration)
{
    // Initialize hours and minutes
    $hours = 0;
    $minutes = 0;

    // Check for hours in the duration
    if (strpos($duration, 'hr') !== false) {
        preg_match('/(\d+)\s*hr/', $duration, $matches);
        if (isset($matches[1])) {
            $hours = (int) $matches[1];
        }
    }

    // Check for minutes in the duration
    if (strpos($duration, 'mins') !== false) {
        preg_match('/(\d+)\s*mins/', $duration, $matches);
        if (isset($matches[1])) {
            $minutes = (int) $matches[1];
        }
    }

    // Create DateInterval with both hours and minutes
    $intervalSpec = 'PT' . $hours . 'H' . $minutes . 'M';
    return new DateInterval($intervalSpec);
}

try {
    $sqlBranchList = 'SELECT * FROM branch_list';
    $stmtBL = $connection->prepare($sqlBranchList);
    $stmtBL->execute();

    $resultBL = $stmtBL->get_result();
    $branchName = [];
    while ($row = $resultBL->fetch_assoc()) {
        $location = $row['branch_name'];

        $marikinaQuery = 'SELECT * FROM booking_table WHERE location=?';
        $stmt = $connection->prepare($marikinaQuery);
        $stmt->bind_param('s', $location);
        $stmt->execute();

        $result = $stmt->get_result();
        $branch_patient_list = [];

        while ($rowList = $result->fetch_assoc()) {
            $dateFormat = $rowList['book_Year'] . '-' . $rowList['book_Month'] + 1 . '-' . $rowList['book_Day'];

            $startTime = new DateTime($rowList['book_Time']);

            $duration = $rowList['duration'];
            $interval = parseDuration($duration);
            $startTime->add($interval);
            $timeAddedDuration = $startTime->format('H:i');

            $data = [
                'id' => $rowList['id'],
                'title' => $rowList['First_Name'] . ' ' . $rowList['Last_Name'],
                'name' => $rowList['First_Name'],
                'lastName' => $rowList['Last_Name'],
                'start' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $rowList['book_Time'],
                'end' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $timeAddedDuration,
                'email' => $rowList['Email'],
                'phoneNum' => $rowList['Phon_Num'],
                'services' => $rowList['service'],
                'notes' => $rowList['Patient_Note'],
                'timeStart' => $rowList['book_Time'],
                'durationP' => $rowList['duration'],
                'status' => $rowList['Patient_Status'],
                'backgroundColor' => $rowList['statsColor'],
                'branch' => $rowList['location'],
            ];
            $branch_patient_list[] = $data;
        }
        $stmt->close();

        $dataList = [
            $row['branch_name'] => $branch_patient_list,
        ];
        $branchName[] = $dataList;
    }

    $stmtBL->close();

    echo json_encode($branchName);
    $connection->close();
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

<?php include 'connection.php';

header('Content-Type: application/json');

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

            if (strpos($rowList['duration'], 'hr') !== false) {
                $interval = new DateInterval('PT' . (int) $rowList['duration'] . 'H');
            } elseif (strpos($rowList['duration'], 'mins') !== false) {
                $interval = new DateInterval('PT' . (int) $rowList['duration'] . 'M');
            }

            $addTimeDuration = new DateTime($rowList['book_Time']);
            $addTimeDuration->add($interval);

            $data = [
                'id' => $rowList['id'],
                'title' => $rowList['First_Name'] . ' ' . $rowList['Last_Name'],
                'start' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $rowList['book_Time'],
                'end' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $addTimeDuration->format('H:i'),
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

<?php include 'connection.php';
header('Content-Type:application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('HTTP/1.1 200 OK');
    exit();
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$firstName = $data->firstName;
$lastName = $data->lastName;
$emailAdd = $data->emailAdd;
$phoneNum = $data->phoneNum;
$selectedBranch = $data->selectedBranch;
$service = $data->service;
$serviceDuration = $data->serviceDuration;

$patientStatus = 'old';
$date = $data->date;
$dateParts = explode('-', $date);
$year = $dateParts[0];
$month = $dateParts[1] - 1;
$day = $dateParts[2];

$time = $data->time;
$notes = $data->notes;
$statsColor = '#FFB64D';

try {
    $sqlQuery = "INSERT INTO booking_table (book_Year, book_Month, book_Day, book_Time, First_Name, 
Last_Name, Email, Phon_Num, Patient_Status, Patient_Note, location, service, duration, statsColor)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    $stmt = $connection->prepare($sqlQuery);
    $stmt->bind_param(
        'iiissssissssss',
        $year,
        $month,
        $day,
        $time,
        $firstName,
        $lastName,
        $emailAdd,
        $phoneNum,
        $patientStatus,
        $notes,
        $selectedBranch,
        $service,
        $serviceDuration,
        $statsColor
    );
    if ($stmt->execute()) {
        echo 'successfully saved new appointment';

        date_default_timezone_set('Asia/Manila');
        $TimeStamp = date('Y-m-d H:i:s');
        $date = new DateTime($TimeStamp);
        $formattedDate = $date->format('M j, Y g:i a');

        $monthName = [
            0 => 'Jan',
            1 => 'Feb',
            2 => 'Mar',
            3 => 'Apr',
            4 => 'May',
            5 => 'Jun',
            6 => 'Jul',
            7 => 'Aug',
            8 => 'Sep',
            9 => 'Oct',
            10 => 'Nov',
            11 => 'Dec',
        ];

        $time12 = date('h:i A', strtotime($time));
        $feed_title = 'Appointment Created';
        $feed_info =
            'Appointment with ' . strtoupper($firstName) . ' ' . strtoupper($lastName) . ' on ' . $monthName[$month] . ' ' . $day . ', ' . $time12;
        $sql_feed = "INSERT INTO activity_feed (feed_title, feed_info, TimeStamp)
        VALUES (?,?,?)";
        $stmt_feed = $connection->prepare($sql_feed);
        $stmt_feed->bind_param('sss', $feed_title, $feed_info, $formattedDate);

        if ($stmt_feed->execute()) {
            echo '/saved feed info';
        }
        $stmt_feed->close();
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$stmt->close();
$connection->close();
?>

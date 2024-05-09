<?php include 'connection.php';

header('Access-Control-Allow-Origin: *');

// Allow specific HTTP methods
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Allow specific HTTP headers
header('Access-Control-Allow-Headers: Content-Type');

// Set the content type to JSON
header('Content-Type: application/json');

date_default_timezone_set('Asia/Manila');

$year = date('Y');
$month = date('m') - 1;
$day = date('d');
$today = date('Y-m-d');

// Get the current date
$currentDate = new DateTime();

// Calculate the start date of the week (Sunday)
$startDate = clone $currentDate;
$startDate->modify('last sunday');

// Calculate the start date of the week before the last Sunday
$lastLastSunday = clone $startDate;
$lastLastSunday->modify('last sunday');

// Calculate the end date of the week (Saturday)
$endDate = clone $currentDate;
$endDate->modify('saturday');

$lastSaturday = clone $endDate;
$lastSaturday->modify('last saturday');

// Format the dates as 'Y-m-d' strings

$lastLastSundayFormatted = $lastLastSunday->format('Y-m-d');
$lastSaturdayFormatted = $lastSaturday->format('Y-m-d');
$startDateFormatted = $startDate->format('Y-m-d');
$endDateFormatted = $endDate->format('Y-m-d');

// ******************************************************************************
// Get the date 30 days before the current date
$Last30Days = clone $currentDate;
$Last30Days->modify('-30 days');
$Last30DaysFormatted = $Last30Days->format('Y-m-d');

// echo $year."-".$month."-".$day;

// ***********minus 30 days***********
// $lastMonth = date('m', strtotime('-1 month', strtotime($today)));

// ********************count Yesterday patient*************************
$lastMonth = date('m', strtotime('first day of -2 month'));

// if($day == 1){
//     $yesterday_SQL = "SELECT * FROM confirmed_booking WHERE book_Year = '$year' && book_Month = '$lastMonth' && book_Day = '$yesterday'";
// }
// else{
//     $yesterday_SQL = "SELECT * FROM confirmed_booking WHERE book_Year = '$year' && book_Month = '$month' && book_Day = '$yesterday'";
// }

// $yesterdayResult = $connection->query($yesterday_SQL);
// $countYesterdayResult = 0;
// while($yesterdayResult->fetch_assoc()){
//     $countYesterdayResult += 1;
// }

$yesterday = date('Y-m-d', strtotime('-1 day'));
$yesterday_SQL = 'SELECT * FROM historyforcustomerdetails';
$yesterday_SQL_result = $connection->query($yesterday_SQL);

$yesterdayCount = 0;
while ($row = $yesterday_SQL_result->fetch_assoc()) {
    $formatted_date = date('Y-m-d', strtotime($row['timestamp']));

    if ($formatted_date == $yesterday) {
        $yesterdayCount += 1;
    }
}

$yesterday2 = 'SELECT * FROM cancelled_booking';
$yesterdayResult = $connection->query($yesterday2);
$getYesterday = '';
while ($row = $yesterdayResult->fetch_assoc()) {
    $formattedDate = $row['book_Year'] . '-' . ($row['book_Month'] + 1) . '-' . $row['book_Day'];
    $getYesterday = date('Y-m-d', strtotime($formattedDate));

    if ($getYesterday == $yesterday) {
        $yesterdayCount += 1;
    }
}

// ******************count todays patient*************************
$todaysPatient = "SELECT * FROM confirmed_booking WHERE book_Year = '$year' && book_Month = '$month' && book_Day ='$day'";
$result = $connection->query($todaysPatient);
$count = 0;
while ($result->fetch_assoc()) {
    $count += 1;
}

$transactedToday = 'SELECT * FROM historyforcustomerdetails';
$transactedTodayResult = $connection->query($transactedToday);
// $todayTransaction = array();
while ($row = $transactedTodayResult->fetch_assoc()) {
    $formatted_date = date('Y-m-d', strtotime($row['timestamp']));
    $todayTransaction[] = $formatted_date;

    if ($formatted_date == $today) {
        $count += 1;
    }
}

$todaysPatient2 = "SELECT * FROM cancelled_booking WHERE book_Year = '$year' && book_Month = '$month' && book_Day = '$day'";
$todaysPatient2result = $connection->query($todaysPatient2);
while ($row = $todaysPatient2result->fetch_assoc()) {
    $count += 1;
}

$percentage_Patients_vs_yesterday = 0; // default value if $yesterdayCount is zero
if ($yesterdayCount != 0) {
    $percentage_Patients_vs_yesterday = intval((($count - $yesterdayCount) / $yesterdayCount) * 100);
}

// ******************count confirmed appointment*******************
$appointments = 'SELECT * FROM confirmed_booking';
$result2 = $connection->query($appointments);
$countAppoint = 0;
while ($result2->fetch_assoc()) {
    $countAppoint += 1;
}

// ******************Total Patients*******************
$totalPatient = 'SELECT * FROM customer_details';
$result3 = $connection->query($totalPatient);
$countPatient = 0;
while ($result3->fetch_assoc()) {
    $countPatient += 1;
}

$firstDayLastMonth = (new DateTime('first day of last month'))->format('Y-m-d');
$lastDayLastMonth = (new DateTime('last day of last month'))->format('Y-m-d');

$lastMonthPatient = "SELECT * FROM customer_details WHERE DATE(timestamp) BETWEEN '$firstDayLastMonth' AND '$lastDayLastMonth'";

$result10 = $connection->query($lastMonthPatient);
$totalPatientLastMonth = 0;
while ($row = $result10->fetch_assoc()) {
    $totalPatientLastMonth += 1;
}

// ******************count total sales Today*******************
$salesToday = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) = '$today'";
$result4 = $connection->query($salesToday);
$todaySalesTotal = 0;
while ($row = $result4->fetch_assoc()) {
    $todaySales = $row['Payment_Cost'];
    $todaySalesTotal += $todaySales;
}

// ******************count total sales Yesterday*******************
$salesYesterday = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) = '$yesterday'";
$result9 = $connection->query($salesYesterday);
$totalSalesYesterday = 0;
while ($row = $result9->fetch_assoc()) {
    $yesterdaySales = $row['Payment_Cost'];
    $totalSalesYesterday += $yesterdaySales;
}

$percentageSales_today_vs_yesterday = 0;
if ($totalSalesYesterday != 0) {
    $percentageSales_today_vs_yesterday = intval(
        (($todaySalesTotal - $totalSalesYesterday) / $totalSalesYesterday) * 100
    );
}

// ******************Sales week*******************
$Salesweek = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) BETWEEN '$startDateFormatted' AND '$endDateFormatted'";
$result5 = $connection->query($Salesweek);
$weekSales = [];

while ($row = $result5->fetch_assoc()) {
    $salesDate = date('Y-m-d', strtotime($row['timestamp']));
    $salesDay = $row['Payment_Cost'];

    // Check if the date is already in the array
    if (isset($weekSales[$salesDate])) {
        // If yes, add the current day's data to the existing sum
        $weekSales[$salesDate] += $salesDay;
    } else {
        // If not, create a new entry in the array
        $weekSales[$salesDate] = $salesDay;
    }

    // echo  $salesDate . " " . $weekSales[$salesDate] . "\n";
}
// Output the results
$responseWeekSales = [];
foreach ($weekSales as $date => $totalSales) {
    $responseWeekSales[$date] = $totalSales;
}

$salesLastWeek = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) BETWEEN '$lastLastSundayFormatted' AND '$lastSaturdayFormatted'";
$result6 = $connection->query($salesLastWeek);
$lastWeekSales = [];

while ($row = $result6->fetch_assoc()) {
    $salesLastSat = date('Y-m-d', strtotime($row['timestamp']));
    $SalesLastSatValue = $row['Payment_Cost'];

    // Check if the date is already in the array
    if (isset($lastWeekSales[$salesLastSat])) {
        // If yes, add the current day's data to the existing sum
        $lastWeekSales[$salesLastSat] += $SalesLastSatValue;
    } else {
        // If not, create a new entry in the array
        $lastWeekSales[$salesLastSat] = $SalesLastSatValue;
    }
}
// Output the results
$responseLastWeekSales = [];
foreach ($lastWeekSales as $date2 => $LastWeektotalSales) {
    $responseLastWeekSales[$date2] = $LastWeektotalSales;
}

// ********************************LAST 30 DAYS**********************************************
$last30daysDate = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) BETWEEN '$Last30DaysFormatted' AND '$today'";
$result7 = $connection->query($last30daysDate);
$last30daysRange = [];
$amcharMonthSales = [];
$last30daySales = [];
while ($row = $result7->fetch_assoc()) {
    $Last30daysValue = date('Y-m-d', strtotime($row['timestamp']));
    $last30daySales2 = $row['Payment_Cost'];

    // Check if the date is already in the array
    if (isset($last30daysRange[$Last30daysValue])) {
        // If yes, add the current day's data to the existing sum
        $last30daysRange[$Last30daysValue] += $last30daySales2;
    } else {
        // If not, create a new entry in the array
        $last30daysRange[$Last30daysValue] = $last30daySales2;
    }

    $date = date('Y-m-d', strtotime($row['timestamp']));
    $value = intval($row['Payment_Cost']);

    if (isset($last30daySales[$date])) {
        // If the date already exists in the array, add the value to the existing value
        $last30daySales[$date] += $value;
    } else {
        // If the date does not exist, create a new entry in the array
        $last30daySales[$date] = $value;
    }
}

// Convert the array into the desired format
foreach ($last30daySales as $date => $value) {
    $monthDaySales = [
        'date' => $date,
        'value' => $value,
    ];
    $amcharMonthSales[] = $monthDaySales;
}

$responselast30daysRange = [];
foreach ($last30daysRange as $date3 => $Last30DaysTotalSales) {
    $responselast30daysRange[$date3] = $Last30DaysTotalSales;
}
// Output the results
// foreach ($amcharMonthSales as $sale) {
//     echo "{'date':'" . $sale['date'] . "', 'value':'" . $sale['value'] . "'}\n";
// }

// ********************************7 days completed and cancelled booking status**********************************************

$completed = [];
$weekdates = date('Y-m-d', strtotime('-7 day'));
$sqlWeekstats = "SELECT DATE(timestamp) AS date, COUNT(*) AS count FROM historyforcustomerdetails WHERE DATE(timestamp) BETWEEN '$weekdates' AND '$today' GROUP BY DATE(timestamp)";
$result = $connection->query($sqlWeekstats);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $completed[$row['date']] = $row['count'];
    }
}

$sqlWeekstatsCancelled = "SELECT DATE(dateCancelled) AS date, COUNT(*) AS count FROM cancelled_booking WHERE DATE(dateCancelled) BETWEEN '$weekdates' AND '$today' GROUP BY DATE(dateCancelled)";
$resultCancelled = $connection->query($sqlWeekstatsCancelled);
$cancelled = [];
if ($resultCancelled->num_rows > 0) {
    while ($row = $resultCancelled->fetch_assoc()) {
        $cancelled[$row['date']] = $row['count'];
    }
}

// ********************************List of all Upcoming patients**********************************************
$result8 = $connection->query($appointments);
$upComingPatient = [];

while ($row = $result8->fetch_assoc()) {
    $confirmDate = $row['book_Year'] . '-' . $row['book_Month'] + 1 . '-' . $row['book_Day'];
    $confirmTime = $row['book_Time'];

    $twelveHourTime = date('h:i A', strtotime($confirmTime));
    $data = [
        date('Y-m-d', strtotime($confirmDate)) . ' ' . "($twelveHourTime)",
        $row['First_Name'] . ' ' . $row['Last_Name'],
    ];
    $upComingPatient[] = $data;
}

$SQL_Antipolo = 'SELECT * FROM confirmed_booking WHERE location="Antipolo"';
$result_Antipolo = $connection->query($SQL_Antipolo);

$fullCalendar_antipolo = [];
$dateFormat = '';
while ($row = $result_Antipolo->fetch_assoc()) {
    $dateFormat = $row['book_Year'] . '-' . $row['book_Month'] + 1 . '-' . $row['book_Day'];

    $response = [
        'id' => $row['id'],
        'title' => $row['First_Name'] . ' ' . $row['Last_Name'],
        'start' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $row['book_Time'],
        'notes' => $row['Patient_Note'],
        'services' => $row['service'],
    ];
    $fullCalendar_antipolo[] = $response;
}

$SQL_Marikina = 'SELECT * FROM confirmed_booking WHERE location="Marikina"';
$result_Marikina = $connection->query($SQL_Marikina);

$fullCalendar_marikina = [];
while ($row = $result_Marikina->fetch_assoc()) {
    $dateFormat = $row['book_Year'] . '-' . $row['book_Month'] + 1 . '-' . $row['book_Day'];

    $response = [
        'id' => $row['id'],
        'title' => $row['First_Name'] . ' ' . $row['Last_Name'],
        'start' => date('Y-m-d', strtotime($dateFormat)) . ' ' . $row['book_Time'],
        'notes' => $row['Patient_Note'],
        'services' => $row['service'],
    ];
    $fullCalendar_marikina[] = $response;
}

// print_r($ConfirmAllBooking);

// foreach ($ConfirmAllBooking as $date) {
//     echo $date . "\n";
// }

$sql_holiday = 'SELECT * FROM list_holiday WHERE location="Marikina"';
$result_holiday = $connection->query($sql_holiday);

while ($row = $result_holiday->fetch_assoc()) {
    $dateFormat = $row['book_Year'] . '-' . $row['book_Month'] + 1 . '-' . $row['book_Day'];

    $response = [
        'id' => $row['id'],
        'title' => $row['day_Remarks'],
        'start' => date('Y-m-d', strtotime($dateFormat)),
        'backgroundColor' => '#2ED8B6',
    ];
    $fullCalendar_marikina[] = $response;
}

$sql_holiday_antipolo = 'SELECT * FROM list_holiday WHERE location="Antipolo"';
$result_holiday_antipolo = $connection->query($sql_holiday_antipolo);

while ($row = $result_holiday_antipolo->fetch_assoc()) {
    $dateFormat = $row['book_Year'] . '-' . $row['book_Month'] + 1 . '-' . $row['book_Day'];

    $response = [
        'id' => $row['id'],
        'title' => $row['day_Remarks'],
        'start' => date('Y-m-d', strtotime($dateFormat)),
        'backgroundColor' => '#2ED8B6',
    ];
    $fullCalendar_antipolo[] = $response;
}

$responseData = [
    'todayPatient' => $count,
    'PatientYesterday' => $yesterdayCount,
    'percentage_Patients_vs_yesterday' => $percentage_Patients_vs_yesterday,
    'totalAppointment' => $countAppoint,
    'totalPatient' => $countPatient,
    'todaySalesTotal' => $todaySalesTotal,
    'totalSalesYesterday' => $totalSalesYesterday,
    'percentageSales_today_vs_yesterday' => $percentageSales_today_vs_yesterday,
    'SuccessProcessYesterday' => $yesterdayCount,
    'totalPatientLastMonth' => $totalPatientLastMonth,
    'responseWeekSales' => $responseWeekSales,
    'responseLastWeekSales' => $responseLastWeekSales,
    'responselast30daysRange' => $responselast30daysRange,
    'completed' => $completed,
    'cancelled' => $cancelled,
    'upComingPatient' => $upComingPatient,
    'amcharMonthSales' => $amcharMonthSales,
    'Calendar_Marikina' => $fullCalendar_marikina,
    'Calendar_Antipolo' => $fullCalendar_antipolo,
];

ksort($responseData['responseWeekSales']);
ksort($responseData['responseLastWeekSales']);
ksort($responseData['responselast30daysRange']);

// Send the data as JSON
header('Content-Type: application/json');
echo json_encode($responseData);

// echo $jsonOutput;
?>


<?php include 'connection.php';

header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

// Set the content type to JSON
header("Content-Type: application/json");





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
$todaysPatient = "SELECT * FROM confirmed_booking WHERE book_Year = '$year' && book_Month = '$month' && book_Day ='$day'";
$appointments = "SELECT * FROM confirmed_booking";
$totalPatient = "SELECT * FROM customer_details";
$salesToday = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) = '$today'";
$Salesweek = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) BETWEEN '$startDateFormatted' AND '$endDateFormatted'";
$salesLastWeek = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) BETWEEN '$lastLastSundayFormatted' AND '$lastSaturdayFormatted'";
$last30daysDate = "SELECT * FROM historyforcustomerdetails WHERE DATE(timestamp) BETWEEN '$Last30DaysFormatted' AND '$today'";

// ******************count todays patient*************************
$result = $connection->query($todaysPatient);
$count = 0;
while ($result->fetch_assoc()) {
    $count += 1;
}

// ******************count confirmed appointment*******************
$result2 = $connection->query($appointments);
$countAppoint = 0;
while ($result2->fetch_assoc()) {
    $countAppoint += 1;
}

// ******************count confirmed appointment*******************
$result3 = $connection->query($totalPatient);
$countPatient = 0;
while ($result3->fetch_assoc()) {
    $countPatient += 1;
}

// ******************count total sales*******************
$result4 = $connection->query($salesToday);
$todaySalesTotal = 0;
while ($row = $result4->fetch_assoc()) {
    $todaySales = $row['Payment_Cost'];
    $todaySalesTotal += $todaySales; // Use += to add to the existing total
}

// ******************Sales week*******************
$result5 = $connection->query($Salesweek);
$weekSales = array();

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
$responseWeekSales = array();
foreach ($weekSales as $date => $totalSales) {

    $responseWeekSales[$date] = $totalSales;
}


$result6 = $connection->query($salesLastWeek);
$lastWeekSales = array();

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
$responseLastWeekSales = array();
foreach ($lastWeekSales as $date2 => $LastWeektotalSales) {

    $responseLastWeekSales[$date2] = $LastWeektotalSales;
}

// ********************************LAST 30 DAYS**********************************************

$result7 = $connection->query($last30daysDate);
$last30daysRange = array();
$amcharMonthSales = array();
$last30daySales = array();
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
    $monthDaySales = array(
        'date' => $date,
        'value' => $value
    );
    $amcharMonthSales[] = $monthDaySales;
}

$responselast30daysRange = array();
foreach ($last30daysRange as $date3 => $Last30DaysTotalSales) {

    $responselast30daysRange[$date3] = $Last30DaysTotalSales;
}
// Output the results
// foreach ($amcharMonthSales as $sale) {
//     echo "{'date':'" . $sale['date'] . "', 'value':'" . $sale['value'] . "'}\n";
// }

// ********************************List of all confirm booking**********************************************
$ConfirmAllBooking = array();
$ConfirmAllNames = array();
$ConfirmAlltimes = array();
$allLocationBranch = array();
$sample = array();
$result8 = $connection->query($appointments);
$upComingPatient = array();
$calendarData = array();
while ($row = $result8->fetch_assoc()) {
    $confirmDate = $row['book_Year'] . "-" . $row['book_Month'] + 1 . "-" . $row['book_Day'];
    $confirmName = $row['First_Name'] . " " . $row['Last_Name'];
    $confirmTime =  $row['book_Time'];

    $ConfirmAllNames[] = $confirmName;
    $ConfirmAllBooking[] = date('Y-m-d', strtotime($confirmDate));
    $ConfirmAlltimes[] = $confirmTime;
    $allLocationBranch[] = $row['location'];

    $twelveHourTime = date("h:i A", strtotime($confirmTime));

    $data = array(
        date('Y-m-d', strtotime($confirmDate)) ." " . "($twelveHourTime)",
        $row['First_Name'] . " " . $row['Last_Name']
    );

    $upComingPatient[] = $data;

    $calendar = array(
        'title' => $row['First_Name'] . " " . $row['Last_Name'],
        'start' => $confirmDate . " " . $confirmTime
    );

    $calendarData[] = $calendar;
    
      
}





// print_r($ConfirmAllBooking);
// print_r($ConfirmAllNames);

// foreach ($ConfirmAllBooking as $date) {
//     echo $date . "\n";
// }
$jsonData = json_encode($calendarData, JSON_UNESCAPED_UNICODE);

$responseData = array(
    'todayPatient' => $count,
    'totalAppointment' => $countAppoint,
    'totalPatient' => $countPatient,
    'totalSales' => $todaySalesTotal,
    'responseWeekSales' => $responseWeekSales,
    'responseLastWeekSales' => $responseLastWeekSales,
    'responselast30daysRange' => $responselast30daysRange,
    'ConfirmAllBooking' => $ConfirmAllBooking,
    'ConfirmAllNames' => $ConfirmAllNames,
    'ConfirmAlltimes' => $ConfirmAlltimes,
    'allLocationBranch' => $allLocationBranch,
    'upComingPatient' => $upComingPatient,
    'amcharMonthSales' => $amcharMonthSales,
 

    );

ksort($responseData['responseWeekSales']);
ksort($responseData['responseLastWeekSales']);
ksort($responseData['responselast30daysRange']);

    // Send the data as JSON
    header('Content-Type: application/json');
    echo json_encode($responseData);
    // echo $jsonOutput;


  
   
    
?>


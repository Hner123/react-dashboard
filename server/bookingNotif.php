<?php include 'connection.php';

$sqlQuery = 'SELECT * FROM booking_table';
$result = $connection->query($sqlQuery);

$count = 0;
while ($result->fetch_assoc()) {
    $count += 1;
}

echo $count;

?>

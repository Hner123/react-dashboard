<?php
$time = '16:00';
$duration = '2 hr'; // or "1 hr"

// Create a DateTime object from the time string
$date = new DateTime($time);

// Determine the interval based on the duration
if (strpos($duration, 'hr') !== false) {
    $interval = new DateInterval('PT' . (int) $duration . 'H');
} elseif (strpos($duration, 'mins') !== false) {
    $interval = new DateInterval('PT' . (int) $duration . 'M');
}

// Add the interval to the time
$date->add($interval);

// Output the result
echo $date->format('H:i');
?>

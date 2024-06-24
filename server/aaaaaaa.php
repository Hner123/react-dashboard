<?php

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

// Example usage
$startTime = new DateTime('12:00');
$duration = '30 mins';
$interval = parseDuration($duration);
$startTime->add($interval);

echo $startTime->format('H:i'); // Outputs 13:30

?>

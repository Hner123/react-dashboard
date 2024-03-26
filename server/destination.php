<?php




$destination = 'C:/xampp/htdocs/react-dashboard/server/image/';
if (!is_dir($destination)) {
    die("Destination directory does not exist or is not a directory");
}
if (!is_writable($destination)) {
    die("Destination directory is not writable by the web server");
}






?>
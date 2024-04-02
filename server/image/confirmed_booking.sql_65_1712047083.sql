-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 01, 2024 at 12:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nerdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `confirmed_booking`
--

CREATE TABLE `confirmed_booking` (
  `id` int(11) NOT NULL,
  `book_Year` int(11) NOT NULL,
  `book_Month` int(11) NOT NULL,
  `book_Day` int(11) NOT NULL,
  `book_Time` time NOT NULL,
  `First_Name` varchar(100) NOT NULL,
  `Last_Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Date_of_Birth` varchar(100) NOT NULL,
  `Phon_Num` bigint(20) NOT NULL,
  `Patient_Status` varchar(100) NOT NULL,
  `Patient_Note` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `service` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `confirmed_booking`
--

INSERT INTO `confirmed_booking` (`id`, `book_Year`, `book_Month`, `book_Day`, `book_Time`, `First_Name`, `Last_Name`, `Email`, `Date_of_Birth`, `Phon_Num`, `Patient_Status`, `Patient_Note`, `location`, `service`) VALUES
(3357, 2024, 3, 1, '00:00:09', 'BITERBO', 'CESAR', 'email_4409@example.com', '1995-12-31', 9876543210, 'New', 'Yet Another Patient Note', 'Antipolo', 'Wisdom Tooth Extraction'),
(3358, 2024, 3, 1, '00:00:11', 'CALIVOSO', 'MARLON', 'email_8188@example.com', '2000-01-01', 1234567890, 'New', 'Random Patient Note', 'Marikina', 'Dentures/Pustiso'),
(3360, 2024, 3, 1, '00:00:07', 'BALANQUIT', 'IVY', 'email_8769@example.com', '1990-03-15', 3456789012, 'New', 'Patient Note 3', 'Marikina', 'Fixed Bridge Dentures'),
(3361, 2024, 4, 26, '00:00:05', 'GALLETA', 'JEMMY JR', 'email_6727@example.com', '1985-06-20', 4567890123, 'Old', 'Patient Note 6', 'Antipolo', 'Panoramic x-ray'),
(3362, 2024, 3, 13, '00:00:18', 'GONEVA', 'ALVIN', 'email_6966@example.com', '1980-09-10', 5678901234, 'New', 'Patient Note 9', 'Marikina', 'Teeth gap closure'),
(3363, 2024, 2, 18, '00:00:05', 'Gonzales', 'Lemuel', 'email_4327@example.com', '1975-12-31', 6789012345, 'Old', 'Patient Note 12', 'Antipolo', 'BracesTeeth Sealant'),
(3370, 2024, 2, 28, '00:00:16', 'Jane', 'Smith', 'jane.smith@example.com', '', 9234567890, 'Old', 'Another note here', 'Antipolo', 'Panoramic x-ray'),
(3372, 2024, 4, 28, '14:30:00', 'Abdul', 'jakol', 'nerborka@gmail.com', '', 9770726480, 'New', 'braces installment', 'Marikina', 'Tooth Extraction'),
(3376, 2024, 0, 30, '10:00:00', 'Mark', 'Francisco', 'nerborka@gmail.com', '', 1234567890, 'New', '', 'Marikina', 'Cleaning'),
(3377, 2024, 0, 30, '10:30:00', 'Vincent', 'Laurel', 'Vincent@gmail.com', '', 9959687513, 'Old', '', 'Marikina', 'Fillings (pasta)'),
(3379, 2024, 0, 30, '11:30:00', 'Cleene', 'Cotton', 'Cleene@gmail.com', '', 1234567890, 'Old', '', 'Marikina', 'Dentures/Pustiso'),
(3380, 2024, 0, 30, '12:00:00', 'Joseph', 'Makjud', 'Joseph@gmail.com', '', 9273078968, 'Old', '', 'Marikina', 'Jacket Crown'),
(3381, 2024, 0, 30, '12:30:00', 'Pancit', 'Canton', 'Pancit@gmail.com', '', 9959687513, 'Old', '', 'Marikina', 'Tooth Extraction'),
(3382, 2024, 0, 30, '13:00:00', 'Master', 'White', 'Master@gmail.com', '', 9959687513, 'Old', '', 'Marikina', 'Frenectomy (lip-tie/tongue-tie)'),
(3383, 2024, 0, 30, '13:30:00', 'Enny', 'Masangya', 'Enny@gmail.om', '', 9959687513, 'New', '', 'Marikina', 'Fixed Bridge Dentures'),
(3384, 2024, 0, 30, '14:00:00', 'Cooper', 'Dog', 'Cooper@gmail.com', '', 9273078968, 'Old', '', 'Marikina', 'Dentures/Pustiso'),
(3385, 2024, 0, 30, '15:30:00', 'Summer', 'Thedog', 'Summer@gmail.com', '', 9273078968, 'New', '', 'Marikina', 'Panoramic x-ray'),
(3386, 2024, 0, 30, '15:00:00', 'Deep', 'Cleanser', 'Deep@gmail.com', '', 9190750552, '', '', 'Marikina', 'Panoramic x-ray'),
(3387, 2024, 0, 30, '16:00:00', 'Wrinklles', 'TheDog', 'Wrinklles@gmail.om', '', 9273078968, 'New', '', 'Marikina', 'Fixed Bridge Dentures'),
(3388, 2024, 0, 30, '16:30:00', 'Zeroil', 'Oil', 'Zeroil@gmail.om', '', 9959687513, 'New', 'Test', 'Marikina', 'Teeth Sealant'),
(3389, 2024, 0, 30, '17:00:00', 'Shao', 'Miiee', 'Shao@gmail.com', '', 9273078968, 'Old', '', 'Marikina', 'Tooth Extraction'),
(3390, 2024, 0, 30, '18:00:00', 'Kojic', 'Plus', 'Kojic@gmail.com', '', 9959687513, 'Old', 'testing syet', 'Marikina', 'Jacket Crown'),
(3391, 2024, 0, 30, '14:30:00', 'Abno', 'Ka', 'Abno@gmail.com', '', 9959687513, 'Old', '', 'Marikina', 'Cleaning'),
(3392, 2024, 1, 14, '16:30:00', 'Mario', 'Akiat', 'nerborka@gmail.com', '', 9959687513, 'Old', 'Ready the carpet', 'Marikina', 'Teeth gap closure'),
(3393, 2024, 1, 18, '11:30:00', 'Junie', 'Ahas', 'nerborka@gmail.com', '', 9190750552, 'New', '', 'Antipolo', 'Panoramic x-ray'),
(3394, 2024, 1, 19, '10:00:00', 'Mark Jay', 'Lolito', 'nerborka@gmail.com', '', 9959687513, 'New', 'Test test', 'Marikina', 'Jacket Crown'),
(3395, 2024, 1, 14, '15:30:00', 'Michael', 'Jordan', 'nerborka@gmail.com', '', 9190750552, 'New', '', 'Marikina', 'Panoramic x-ray'),
(3396, 2024, 1, 14, '16:30:00', 'Balen', 'Tayns', 'nerborka@gmail.com', '', 9959687513, 'New', 'Test email 2nd branch', 'Antipolo', 'Teeth Sealant'),
(3397, 2024, 1, 13, '14:30:00', 'Jose', 'Rizal', 'nerborka@gmail.com', '', 9190750552, 'Old', 'Test for email.', 'Marikina', 'Whitening'),
(3398, 2024, 1, 14, '12:00:00', 'Yude', 'Fota', 'fotaena@gmail.com', '', 9959687513, 'Old', 'Yawaka', 'Marikina', 'Veneers'),
(3399, 2024, 1, 10, '15:00:00', 'Jeelin', 'Inamac', 'nerborka@gmail.com', '', 9273078968, 'New', 'Test for beep card', 'Antipolo', 'Fillings (pasta)'),
(3400, 2024, 1, 14, '14:30:00', 'Loren', 'Legarda', 'qwe@gmail.com', '', 9618204853, 'Old', 'Test', 'Marikina', 'Teeth Sealant'),
(3401, 2024, 1, 25, '12:00:00', 'jeelin', 'Inamac', 'nerborka@gmail.com', '', 1234567890, 'New', '', 'Marikina', 'Braces'),
(3402, 2024, 1, 25, '16:30:00', 'Kevin Andrew', 'Jambre', 'poiytpoiyt06@gmail.com', '', 63928125600, 'Old', 'test', 'Marikina', 'Cleaning'),
(3409, 2024, 2, 30, '16:30:00', 'Mark', 'Joson', 'nerborka@gmail.com', '', 9959687513, 'Old', '430', 'Marikina', 'Braces');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `confirmed_booking`
--
ALTER TABLE `confirmed_booking`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `confirmed_booking`
--
ALTER TABLE `confirmed_booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3410;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

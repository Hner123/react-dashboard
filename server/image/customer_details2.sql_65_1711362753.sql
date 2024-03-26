-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2024 at 05:28 PM
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
-- Table structure for table `customer_details`
--

CREATE TABLE `customer_details` (
  `id` int(11) NOT NULL,
  `Fname` varchar(100) NOT NULL,
  `Sname` varchar(100) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Address` varchar(255) NOT NULL,
  `emailAdd` varchar(100) NOT NULL,
  `phoneNum` bigint(20) NOT NULL,
  `Gender` varchar(100) NOT NULL,
  `CustomerNotes` text NOT NULL,
  `profile_image` longblob NOT NULL,
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_details`
--

INSERT INTO `customer_details` (`id`, `Fname`, `Sname`, `DateOfBirth`, `Address`, `emailAdd`, `phoneNum`, `Gender`, `CustomerNotes`, `profile_image`, `TimeStamp`) VALUES
(131, 'Celily Grace ', 'Nocum ', '1993-11-19', 'Toting Reyes St.', 'Nocum@gmail.com', 123456789, 'Female', 'Braces installment at 50% promo in Main Branch Medical History: Asthma, had braces befores. referred 3 people along with hers\n', '', '2024-03-22 10:23:23'),
(130, 'Celily Grace', 'Nocum', '1993-12-12', 'Toting Reyes St.', 'nocum@gmail.com', 123456789, 'Male', 'Braces installment at 50% promo in Main Branch\r\nMedical History: Asthma, had braces befores.\r\nreferred 3 people along with her', '', '2023-12-21 18:39:47'),
(129, 'Celily Grace', 'Nocum ', '1993-11-19', 'Toting Reyes St.', 'Nocum@gmail.com', 123456789, 'Female', 'Brace insallment at 50% June Promo\r\nMedical History: asthma\r\nisa syang mahinang nilalang', '', '2023-12-21 18:37:02'),
(128, 'First2', 'Last2', '1993-12-12', 'last2@gmail.com', 'try@gmail.com', 1234567890, 'Male', 'Installment of Braces, at 50% - 5000 Downpayment.', '', '2023-12-20 18:56:54'),
(126, 'John', 'Doe', '0000-00-00', 'Gilmore Manila City', 'JohnDoe@gmail.com', 9959687513, 'Male', 'Facebook client/ 2024-01-24(kulang ng piso ang binayad nya', '', '2024-01-24 03:21:27'),
(127, 'Franceska', 'Aborka', '1993-12-19', 'New Buswang, Kalibo, Aklan', 'franz@gmail.com', 9123456789, 'Female', 'Shhesssss', '', '2023-12-20 18:07:07'),
(125, 'FirstName56', 'LastName66', '1988-08-09', 'Address10', 'email66530@example.com', 12345678910242, 'Female', 'Notes24', '', '2023-08-28 02:32:37'),
(123, 'FirstName82', 'LastName83', '1990-06-04', 'Address90', 'email49397@example.com', 123456789747239, 'Female', 'Notes2', '', '2022-01-16 02:32:37'),
(124, 'FirstName83', 'LastName3', '1989-08-18', 'Address17', 'email89777@example.com', 123456789971723, 'Female', 'Notes91', '', '2023-09-01 02:32:37'),
(122, 'FirstName23', 'LastName61', '1980-11-23', 'Address96', 'email74975@example.com', 123456789844761, 'Male', 'Notes33', '', '2020-02-17 02:32:37'),
(120, 'FirstName8', 'LastName80', '1992-05-12', 'Address32', 'email38039@example.com', 123456789931052, 'Male', 'Notes77', '', '2022-04-01 02:32:37'),
(121, 'FirstName38', 'LastName91', '1981-12-31', 'Address26', 'email10026@example.com', 123456789720817, 'Female', 'Notes35', '', '2019-09-02 02:32:37'),
(119, 'FirstName78', 'LastName68', '1972-03-30', 'Address31', 'email37408@example.com', 123456789911250, 'Female', 'Notes43', '', '2019-07-30 02:32:37'),
(117, 'FirstName57', 'LastName69', '1992-04-17', 'Address64', 'email99012@example.com', 12345678917979, 'Female', 'Notes54', '', '2022-03-03 02:32:37'),
(118, 'FirstName16', 'LastName76', '1979-09-05', 'Address31', 'email60968@example.com', 123456789101574, 'Male', 'Notes8', '', '2021-12-02 02:32:37'),
(116, 'FirstName30', 'LastName44', '1979-11-08', 'Address29', 'email49881@example.com', 123456789603261, 'Male', 'Notes78', '', '2022-01-12 02:32:37'),
(114, 'FirstName49', 'LastName9', '1999-04-06', 'Address60', 'email11582@example.com', 123456789752831, 'Female', 'Notes82', '', '2019-08-07 02:32:37'),
(113, 'FirstName7', 'LastName48', '1976-05-16', 'Address60', 'email38673@example.com', 123456789119101, 'Female', 'Notes81', '', '2020-01-09 02:32:37'),
(111, 'FirstName51', 'LastName38', '1982-05-09', 'Address89', 'email23149@example.com', 123456789476958, 'Male', 'Notes2', '', '2023-10-23 02:32:37'),
(112, 'FirstName9', 'LastName40', '1991-02-10', 'Address31', 'email48401@example.com', 123456789462140, 'Male', 'Notes90', '', '2019-03-07 02:32:37'),
(107, 'FirstName46', 'LastName77', '1984-11-06', 'Address15', 'email26658@example.com', 123456789881401, 'Male', 'Notes39', '', '2023-04-11 02:32:37'),
(108, 'FirstName51', 'LastName17', '1979-01-14', 'Address99', 'email6968@example.com', 123456789364119, 'Male', 'Notes96', '', '2019-01-04 02:32:37'),
(109, 'FirstName6', 'LastName35', '1986-09-29', 'Address73', 'email1991@example.com', 123456789882423, 'Female', 'Notes11', '', '2021-05-24 02:32:37'),
(110, 'FirstName23', 'LastName62', '1982-07-23', 'Address22', 'email85138@example.com', 123456789592065, 'Female', 'Notes25', '', '2023-09-11 02:32:37'),
(65, 'Heiner', 'Aborka', '1993-11-19', 'Santolan Pasig City', 'nerborka@gmail.com', 9959687513, 'Male', 'Heine poge\n-Kyot pa\n-Niyawa', 0x70726f66696c655f36355f313731313239333534312e706e67, '2024-03-24 15:20:07'),
(132, 'Kyot', 'ABORKA', '2023-12-26', 'TLL SUBD  NEW BUSWANG KALIBO AKLAN', 'nerborka@gmail.com', 9162220700, 'Male', 'asdasd', '', '2023-12-25 16:04:38'),
(137, 'HEINER2', 'ABORKA', '2023-12-26', 'TLL SUBD  NEW BUSWANG KALIBO AKLAN', 'nerborka@gmail.com', 9162220700, 'Male', 'asd', '', '2024-03-19 10:14:44'),
(136, 'Maria', 'Tomas', '2023-12-26', 'TLL SUBD  NEW BUSWANG KALIBO AKLAN', 'nerborka@gmail.com', 9273078968, 'Male', 'asd', '', '2023-12-26 07:18:04'),
(140, 'Dokie', 'Doks', '1993-12-19', 'Toting reyes st.', 'nerborka@gmail.com', 9959687513, 'Male', 'FB - Client', '', '2024-03-19 07:42:39'),
(139, 'Jeelin', 'Inamac', '1993-11-19', 'TLL SUBD  NEW BUSWANG KALIBO AKLAN', 'nerborka@gmail.com', 9273078968, 'Female', 'Refer ni Jade.', 0x70726f66696c655f3133395f313731313239333633352e77656270, '2024-03-24 15:20:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer_details`
--
ALTER TABLE `customer_details`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer_details`
--
ALTER TABLE `customer_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

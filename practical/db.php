<?php
session_start();

$dbname = $_SESSION['dbname'] ?? 'college';
$conn = mysqli_connect("localhost", "root", "", $dbname);

if (!$conn) die("Connection failed");
?>
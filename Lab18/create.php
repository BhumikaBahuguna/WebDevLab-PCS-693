<?php
session_start();

if (isset($_POST['create'])) {

    $dbname = str_replace(" ", "_", trim($_POST['dbname']));
    $_SESSION['dbname'] = $dbname;

    $conn = mysqli_connect("localhost", "root", "");
    if (!$conn) die("Connection failed");

    mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS `$dbname`");
    mysqli_select_db($conn, $dbname);

    $sql = "CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rollno INT UNIQUE,
        name VARCHAR(50),
        sub1 INT, sub2 INT, sub3 INT, sub4 INT
    )";

    $_SESSION['message'] = mysqli_query($conn, $sql)
        ? "Database & Table created!"
        : "Error";

    header("Location: home.php");
    exit();
}
?>
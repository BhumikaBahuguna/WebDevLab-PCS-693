<?php
session_start();

if (isset($_POST['create'])) {

    $dbname = str_replace(" ", "_", trim($_POST['dbname']));
    $_SESSION['dbname'] = $dbname;

    $conn = mysqli_connect("localhost", "root", "");
    if (!$conn) die("Connection failed");

    mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS `$dbname`");
    mysqli_select_db($conn, $dbname);

    $sql = "CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100),
        author VARCHAR(100),
        availability VARCHAR(20)
    )";

    $_SESSION['message'] = mysqli_query($conn, $sql)
        ? "Database & Table created!"
        : "Error";

    header("Location: home.php");
    exit();
}
?>
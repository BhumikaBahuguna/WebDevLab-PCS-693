<?php
session_start();

if (isset($_POST['register'])) {
    $_SESSION['name'] = $_POST['name'];
    $_SESSION['age'] = $_POST['age'];
    $_SESSION['branch'] = $_POST['branch'];
    $_SESSION['password'] = $_POST['password'];

    header("Location: login.php");
    exit();
}

if (isset($_POST['login'])) {
    if (
        $_POST['name'] == $_SESSION['name'] &&
        $_POST['password'] == $_SESSION['password']
    ) {
        $_SESSION['loggedin'] = true;
        header("Location: student.php");
        exit();
    } else {
        echo "Invalid Login";
    }
}
?>
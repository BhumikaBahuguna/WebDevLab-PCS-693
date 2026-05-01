<?php
session_start();

if (!isset($_SESSION['loggedin'])) {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Student</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<form>
<h3>Welcome</h3>

<p>Name: <?php echo $_SESSION['name']; ?></p>
<p>Age: <?php echo $_SESSION['age']; ?></p>
<p>Branch: <?php echo $_SESSION['branch']; ?></p>

<button formaction="logout.php">Logout</button>
</form>
</body>
</html>
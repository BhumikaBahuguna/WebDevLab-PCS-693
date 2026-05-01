<?php
session_start();
session_destroy();
?>
<!DOCTYPE html>
<html>
<head>
<title>Logout</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<form>
<h3>Logged out successfully</h3>
<a href="login.php">Click here to login</a>
</form>
</body>
</html>
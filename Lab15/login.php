<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<form method="post" action="auth.php">
<h3>Login</h3>
<input type="text" name="name" placeholder="Name" required><br>
<input type="password" name="password" placeholder="Password" required><br>
<button type="submit" name="login">Login</button>
</form>
</body>
</html>
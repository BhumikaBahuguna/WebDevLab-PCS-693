<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
<title>Register</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<form method="post" action="auth.php">
<h3>Register</h3>

<label>Name:</label>
<input type="text" name="name" required><br>

<label>Age:</label>
<input type="number" name="age" required><br>

<label>Branch:</label>
<select name="branch">
<option value="CSE">CSE</option>
<option value="IT">IT</option>
<option value="ECE">ECE</option>
<option value="ME">ME</option>
</select><br>

<label>Password:</label>
<input type="password" name="password" required><br>

<button type="submit" name="register">Register</button>
</form>
</body>
</html>
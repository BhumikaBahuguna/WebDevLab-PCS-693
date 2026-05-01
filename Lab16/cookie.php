<?php
session_start();

// Handle logout
if (isset($_POST['logout'])) {
    header("Location: logout.php");
    exit();
}

// Visit counter
$_SESSION['visits'] = ($_SESSION['visits'] ?? 0) + 1;

// Handle name submission
if (isset($_POST['name'])) {
    setcookie('username', $_POST['name'], time() + 3600);
    header("Location: cookie.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Cookie & Session Counter</title>
<style>
body {
    background: linear-gradient(to right, #fbc2eb, #a6c1ee);
    font-family: Arial, sans-serif;
    text-align: center;
}
.container {
    background: white;
    width: 350px;
    margin: 80px auto;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
}
h2 { color: #4c1d95; }
h3 { color: #1e40af; }
input[type="text"] {
    padding: 8px;
    width: 80%;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
input[type="submit"] {
    margin-top: 15px;
    padding: 10px 15px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
input[type="submit"]:hover {
    background: #1e40af;
}
</style>
</head>
<body>

<div class="container">

<h2>Welcome to Our Website</h2>

<?php
if (isset($_COOKIE['username'])) {
    echo "<h2>Welcome back " . $_COOKIE['username'] . "</h2>";
} else {
?>
<form method="post">
    <label>Enter your name:</label><br>
    <input type="text" name="name">
    <br>
    <input type="submit" value="Submit">
</form>
<?php
}

echo "<h3>Visits Count: " . $_SESSION['visits'] . "</h3>";
?>

<br>

<form method="post">
    <input type="submit" name="logout" value="Logout">
</form>

</div>
</body>
</html>
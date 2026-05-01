<?php
session_start();
$message = $_SESSION['message'] ?? "";
unset($_SESSION['message']);
?>
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Home - Create Database & Table</h2>

<?php if ($message) echo "<div class='message'>$message</div>"; ?>

<form method="POST" action="create.php">
<input type="text" name="dbname" placeholder="Database Name" required>
<input type="submit" name="create" value="Create">
</form>

<br>

<form action="insert.php"><button>Insert</button></form>
<form action="update.php"><button>Update</button></form>
<form action="delete.php"><button>Delete</button></form>
<form action="view.php"><button>View</button></form>

</body>
</html>
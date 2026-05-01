<?php
include "db.php";

$message = "";

if (isset($_POST['delete'])) {
    $query = "DELETE FROM students WHERE rollno='{$_POST['rollno']}'";

    $message = mysqli_query($conn, $query)
        ? "Deleted successfully!"
        : "Error";
}
?>
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Delete Record</h2>

<?php if ($message) echo "<div class='message'>$message</div>"; ?>

<form method="POST">
<input type="number" name="rollno" placeholder="Roll No" required>
<input type="submit" name="delete" value="Delete">
</form>

<form action="home.php"><button>Back</button></form>

</body>
</html>
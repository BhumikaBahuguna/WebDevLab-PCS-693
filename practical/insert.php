<?php
include "db.php";

$message = "";

if (isset($_POST['submit'])) {
    $query = "INSERT INTO books (title, author, availability)
    VALUES ('{$_POST['title']}', '{$_POST['author']}', '{$_POST['availability']}')";

    $message = mysqli_query($conn, $query)
        ? "Inserted successfully!"
        : "Error";
}
?>

<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Insert Book</h2>

<?php if ($message) echo "<div class='message'>$message</div>"; ?>

<form method="POST">
<input type="text" name="title" placeholder="Book Title" required>
<input type="text" name="author" placeholder="Author" required>

<select name="availability">
<option value="Available">Available</option>
<option value="Not Available">Not Available</option>
</select>

<input type="submit" name="submit" value="Insert">
</form>

<form action="home.php"><button>Back</button></form>

</body>
</html>
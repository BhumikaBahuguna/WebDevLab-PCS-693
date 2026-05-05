<?php
include "db.php";

$message = "";

if (isset($_POST['delete'])) {
    $query = "DELETE FROM books WHERE id='{$_POST['id']}'";

    $message = mysqli_query($conn, $query)
        ? "Deleted successfully!"
        : "Error";
}
?>

<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Delete Book</h2>

<?php if ($message) echo "<div class='message'>$message</div>"; ?>

<form method="POST">
<input type="number" name="id" placeholder="Book ID" required>
<input type="submit" name="delete" value="Delete">
</form>

<form action="home.php"><button>Back</button></form>

</body>
</html>
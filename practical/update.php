<?php
include "db.php";

$message = "";

if (isset($_POST['update'])) {
    $query = "UPDATE books SET
    title='{$_POST['title']}',
    author='{$_POST['author']}',
    availability='{$_POST['availability']}'
    WHERE id='{$_POST['id']}'";

    $message = mysqli_query($conn, $query)
        ? "Updated successfully!"
        : "Error";
}
?>

<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Update Book</h2>

<?php if ($message) echo "<div class='message'>$message</div>"; ?>

<form method="POST">
<input type="number" name="id" placeholder="Book ID" required>
<input type="text" name="title" placeholder="Title" required>
<input type="text" name="author" placeholder="Author" required>

<select name="availability">
<option value="Available">Available</option>
<option value="Not Available">Not Available</option>
</select>

<input type="submit" name="update" value="Update">
</form>

<form action="home.php"><button>Back</button></form>

</body>
</html>
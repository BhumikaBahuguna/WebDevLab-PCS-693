<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Odd or Even</title>
</head>
<body>
    <h2>Problem 2</h2>
    <form method="post">
        <label>Enter a number:</label><br><br>
        <input type="number" name="number" required><br><br>
        <button type="submit">Check</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $number = $_POST["number"];

        if ($number % 2 == 0) {
            echo "<p>$number is Even</p>";
        } else {
            echo "<p>$number is Odd</p>";
        }
    }
    ?>
</body>
</html>

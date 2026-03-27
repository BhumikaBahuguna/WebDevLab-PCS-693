<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Average and Smallest</title>
</head>
<body>
    <h2>Problem 4</h2>
    <form method="post">
        <label>First number:</label><br><br>
        <input type="number" name="num1" required><br><br>

        <label>Second number:</label><br><br>
        <input type="number" name="num2" required><br><br>

        <label>Third number:</label><br><br>
        <input type="number" name="num3" required><br><br>

        <button type="submit">Find Result</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $num1 = $_POST["num1"];
        $num2 = $_POST["num2"];
        $num3 = $_POST["num3"];

        $average = ($num1 + $num2 + $num3) / 3;

        if ($num1 <= $num2 && $num1 <= $num3) {
            $smallest = $num1;
        } elseif ($num2 <= $num1 && $num2 <= $num3) {
            $smallest = $num2;
        } else {
            $smallest = $num3;
        }

        echo "<p>Average = $average</p>";
        echo "<p>Smallest number = $smallest</p>";
    }
    ?>
</body>
</html>

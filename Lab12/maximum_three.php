<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Maximum of Three Numbers</title>
</head>
<body>
    <h2>Problem 3</h2>
    <form method="post">
        <label>First number:</label><br><br>
        <input type="number" name="num1" required><br><br>

        <label>Second number:</label><br><br>
        <input type="number" name="num2" required><br><br>

        <label>Third number:</label><br><br>
        <input type="number" name="num3" required><br><br>

        <button type="submit">Find Maximum</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $num1 = $_POST["num1"];
        $num2 = $_POST["num2"];
        $num3 = $_POST["num3"];

        if ($num1 >= $num2 && $num1 >= $num3) {
            $max = $num1;
        } elseif ($num2 >= $num1 && $num2 >= $num3) {
            $max = $num2;
        } else {
            $max = $num3;
        }

        echo "<p>Maximum number is: $max</p>";
    }
    ?>
</body>
</html>

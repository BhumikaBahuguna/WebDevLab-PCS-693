<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Simple Calculator</title>
</head>
<body>
    <h2>Problem 5</h2>
    <form method="post">
        <label>First number:</label><br><br>
        <input type="number" step="any" name="num1" required><br><br>

        <label>Second number:</label><br><br>
        <input type="number" step="any" name="num2" required><br><br>

        <label>Select operation:</label><br><br>
        <select name="operation" required>
            <option value="add">Addition</option>
            <option value="subtract">Subtraction</option>
            <option value="multiply">Multiplication</option>
            <option value="divide">Division</option>
        </select><br><br>

        <button type="submit">Calculate</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $num1 = $_POST["num1"];
        $num2 = $_POST["num2"];
        $operation = $_POST["operation"];

        if ($operation == "add") {
            $result = $num1 + $num2;
            echo "<p>Result = $result</p>";
        } elseif ($operation == "subtract") {
            $result = $num1 - $num2;
            echo "<p>Result = $result</p>";
        } elseif ($operation == "multiply") {
            $result = $num1 * $num2;
            echo "<p>Result = $result</p>";
        } elseif ($operation == "divide") {
            if ($num2 != 0) {
                $result = $num1 / $num2;
                echo "<p>Result = $result</p>";
            } else {
                echo "<p>Division by zero is not possible</p>";
            }
        }
    }
    ?>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>Odd or Even Checker</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6fb;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #1f2a44;
        }
        .form-group {
            margin: 20px 0;
        }
        input {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 200px;
        }
        button {
            background-color: #2563eb;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #1e40af;
        }
        .result {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
            font-size: 18px;
        }
        .even {
            color: #16a34a;
        }
        .odd {
            color: #dc2626;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Odd or Even Checker</h1>
        <form method="post">
            <div class="form-group">
                <label>Enter a number:</label><br><br>
                <input type="number" name="number" required>
                <button type="submit">Check</button>
            </div>
        </form>

        <?php
            $number = $_POST["number"] ?? "";
            if ($number !== "") {
                if ($number % 2 == 0) {
                    echo "<div class='result'><span class='even'>$number is an EVEN number</span></div>";
                } else {
                    echo "<div class='result'><span class='odd'>$number is an ODD number</span></div>";
                }
            }
        ?>
    </div>
</body>
</html>

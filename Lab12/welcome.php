<!DOCTYPE html>
<html>
<head>
    <title>Echo Program</title>
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
        .output {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Echo Program</h1>
        <div class="output">
            <?php
                echo "Hello, Welcome to PHP Programming!<br>";
                echo "This is a message printed using echo statement.<br>";
                echo "PHP is a server-side scripting language.";
            ?>
        </div>
    </div>
</body>
</html>
<?php
$filename = "input.txt";
$file = fopen($filename, "w");
$content = "Hello World! This is a PHP file handling example.";
fwrite($file, $content);
fclose($file);
$readFile = fopen($filename, "r");
$consonantFile = fopen("consonant.txt", "w");
$vowelFile = fopen("vowel.txt", "w");
while(($char = fgetc($readFile)) !== false) {
    if(ctype_alpha($char)) {
        if(in_array(strtolower($char), ['a','e','i','o','u'])) {
            fwrite($vowelFile, $char);
        } else {
            fwrite($consonantFile, $char);
        }
    } else {
        fwrite($vowelFile, $char);
    }
}
fclose($readFile);
fclose($consonantFile);
fclose($vowelFile);
echo "Processing complete! Check consonant.txt and vowel.txt files.";
?>
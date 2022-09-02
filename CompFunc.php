<?php
// $firstFile = file_get_contents('one.php');
// $secondFile = file_get_contents('two.php');

function compare($first, $second){

    $firstFile = file_get_contents($first); // get content of the first file
    $postedContent = $second; // ..
    $firstFile = trim(preg_replace('/\s+/', ' ', $firstFile)); // replace white spaces with one space
    $postedContent = trim(preg_replace('/\s+/', ' ', $second)); // ..

    $matchCount = preg_match_all("/<\?(php)?(.+?)\?>/is", $firstFile, $match1); // count of matching php tags &store in $match1 arr
    preg_match_all("/<\?(php)?(.+?)\?>/is", $postedContent, $match2); // ..

    if( count($match1[2]) != count($match2[2]) ){
        return true;  // if count of php tags is not the same in two files this means there is change in php
    }
    
    for($i=0; $i < $matchCount; $i++)
    {
        if($match1[2][$i] != $match2[2][$i]){
            return true;
        }
    }
    return false;
}

// TESTING //

// if(compare('one.php','two.php'))
// {
//     echo'php is changed';
// }else{
//     echo'false , its not changed';
// }
?>
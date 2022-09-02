<?php

include('folder_path.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $path = $search_dir . '\\'. $_POST['path'];

    $exploded_path = explode('\\',$path);
    $file_name = array_pop($exploded_path);
    $dir_path = implode('\\',$exploded_path);

    if(!isset(pathinfo($path)['extension'])) return false;
    $ext = strtolower(pathinfo($file_name)['extension']);

    if(file_exists($path) && 
    ($ext == 'html' ||$ext == 'css' || $ext == 'js' || $ext == 'php') &&
     (preg_match("/\.priv./i", $file_name) != 1 && preg_match("/copy./i", $file_name) != 1 ))
    {
        if(pathinfo($path)['extension'] == 'php'){
            $arr = (explode('\\' , $dir_path));
            $fileDir = array_pop($arr);
            if(strtolower($fileDir) !== 'html'){
                echo'Not allowed';
                return;
            }
        }

        openFile($path);

    }else{
        echo'Not allowed';
        return;
    }
}

function openFile($path){
    $fileContent = file_get_contents($path);
    echo $fileContent;
}
?>
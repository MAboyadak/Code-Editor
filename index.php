<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <link rel="stylesheet" href="style.css">
    <?php
    $connected = @fsockopen("www.google.com", 80); 
    if($connected)
    {
        $f_a = 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' ;
        fclose($connected);
    } else {
        $f_a = 'fontawesome.min.css';
    }
    ?>
    <link rel="stylesheet" href="<?php echo $f_a; ?>">
</head>
<body>

<?php
    $search_dir = 'C:\xampp\htdocs\upwork' ;  /// specify the path
    // include('folder_path.php');
?>
<?php


function listfiles($mydir){
    $filesArr = array();
    $dirArr = array();
    $handle = opendir($mydir);
    while (false !== ($entry = readdir($handle))) {
        if(is_dir($mydir. '\\'. $entry)){
            if($entry == '.' || $entry =='..' ) continue;
            $dirArr[] = $entry;
        }else{
            $filesArr[] = $entry;
        }
    }

    echo '<ul>';
    foreach($dirArr as $dirr){
        echo '<li class="folder"><i class="fa fa-angle-right"></i><i class="fa fa-folder"></i>'.$dirr;
        listfiles($mydir.'\\'.$dirr);
        echo '</li>';
    }
    foreach($filesArr as $file){
        if(!isset(pathinfo($file)['extension'])) continue;

        $ext = strtolower(pathinfo($file)['extension']);
        if(
            ($ext == 'html' ||$ext == 'css' || $ext == 'js' || $ext == 'php') && 
            (preg_match("/\.priv./i", $file) != 1 && preg_match("/copy./i", $file) != 1 ))
        {
            if($ext == 'php'){
                $arr = (explode('\\' , $mydir));
                $fileDir = array_pop($arr);
                if(strtolower($fileDir) !== 'html'){
                    continue;
                }
            }
            echo '<li class="file">'.$file.'</li>';
        }else{
            continue;
        }

    }
    echo '</ul>';
}

?>

<div id=container>
    <div class="top-bar">
        <button id="logout-btn" disabled>LOGOUT</button>
        <button id="save-btn" onclick="updateFile()" disabled>SAVE <span>(or use CTRL+S/CMD+S)</span></button>
    </div>
    <div id="wrapper">
        <div id="c1">
            <div class="explorer">
                <?php
                    
                    listfiles($search_dir);

                ?>
            </div>        

        </div>
        <div id="c2"></div>
    </div>
</div>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
    require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
      require(['vs/editor/editor.main'], function() {
        window.editor = monaco.editor.create(document.getElementById('c2'), {
            value: [
              '\n\n\n\n\t\t\t\t\t This is a default text that can\'t be changed, open your files from explorer in the left\n'
            ].join('\n'),
            theme:"vc",
            language: 'txt',
            scrollBeyondLastLine: false,
            readOnly: true,
            roundedSelection: false,
        });
      });
</script>
<script src="script.js"></script>
</body>
</html>
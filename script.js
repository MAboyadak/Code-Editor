var firstUl = document.querySelector("ul");
var allListItems = document.querySelectorAll('li');
var allArrows = document.querySelectorAll('li i');
// var re = /(?:\.([^.]+))?$/; // regular expresion to get the extension

var fileContent = 'default';
var fileName = '';

function bkAllToDef(){
  allListItems.forEach(element=>{
    element.style.backgroundColor = 'unset';
    element.style.color = 'unset';
    if(element.children.length > 0){
      element.querySelector('i.fa-folder').style.color = 'unset';
    }
  })
}

function showFirstLis(){
    firstUl.style.display='block';
}

function addClickListner(){
  allListItems.forEach(element=>{
    element.addEventListener('click',checkDirectory);
  });
}
function addArrowListner(){
  allArrows.forEach(element=>{
    element.addEventListener('click',checkArrowDir);
  });
}

function checkDirectory(e){
  e.stopPropagation();
  bkAllToDef();
  // console.log(e);
  // console.log(e.target);
  if(e.target.children.length == 2){ // has only one element ' <i> ' which means it's empty directory
    if(e.target.querySelector('i.fa-angle-right').style.transform == 'rotate(0deg)'){
      e.target.querySelector('i.fa-angle-right').style.transform = 'rotate(90deg)';
    }else{
      e.target.querySelector('i.fa-angle-right').style.transform = 'rotate(0deg)';
    }
    e.target.style.backgroundColor = '#555';
    e.target.style.color = '#e6e6e6';
  }else if(e.target.children.length > 2){ // has at least <i> and <ul> elements which means it's a directory
    toggleShowing(e.target);
    e.target.style.backgroundColor = '#555';
    e.target.style.color = '#e6e6e6';
  }else{ // length == 0 which means it's a file (no children elements)

    // check the file saved or not before open another one //
    if(fileName){ // first check if any file opened
      if (fileContent !== window.monacoEditor.getValue()){  // check if file content has chenged and not saved
        if (confirm("Press 'OK' if you forgot to save the changes!")){ // if 'ok' then save if 'cancel' don't save
          updateFile();
        }
      }
    }
    // 
    e.target.style.backgroundColor = '#555';
    e.target.style.color = '#e6e6e6';
    document.getElementById('save-btn').disabled = false;

    var path = ''; // fileName
    var parents = getParents(e.target);

    if(parents == null){
      path = e.target.childNodes[0].nodeValue;
      openFile(path);
      return;
    }

    parents.forEach(element => {
      element.childNodes.forEach(curNode => {
        if (curNode.nodeType == Node.TEXT_NODE) {
          path = curNode.nodeValue + '\\' + path;
        }
      });
    });
    path = path.slice(0,-1); // to remove last '/'
    // console.log(path);

    openFile(path);
  }
}

function checkArrowDir(e){
  e.stopPropagation();
  bkAllToDef();
  var parentLI = e.target.closest('li');
  if(parentLI.children.length == 2){ // has only one element ' <i> ' which means it's empty directory
    if(parentLI.querySelector('i.fa-angle-right').style.transform == 'rotate(0deg)'){
      parentLI.querySelector('i.fa-angle-right').style.transform = 'rotate(90deg)';
    }else{
      parentLI.querySelector('i.fa-angle-right').style.transform = 'rotate(0deg)';
    }
    parentLI.style.backgroundColor = '#555';
    parentLI.style.color = '#e6e6e6';
  }else if(parentLI.children.length > 2){ // has at least <i> and <ul> elements which means it's a directory
    toggleShowing(parentLI);
    parentLI.style.backgroundColor = '#555';
    parentLI.style.color = '#e6e6e6';
  }else{ // length == 0 which means it's a file (no children elements)

    if(fileName){ // first check if any file opened before
      if (fileContent !== window.monacoEditor.getValue()){  // check if file content has chenged and not saved
        if (confirm("Press 'OK' if you forgot to save the changes!")){ // if 'ok' then save if 'cancel' don't save
          updateFile();
          return;
        }
      }
    }
    // 
    e.target.style.backgroundColor = '#555';
    e.target.style.color = '#e6e6e6';
    document.getElementById('save-btn').disabled = false;

    var path = ''; // fileName
    var parents = getParents(parentLI);

    if(parents == null){
      path = parentLI.childNodes[0].nodeValue;
      openFile(path);
      return;
    }

    parents.forEach(element => {
      element.childNodes.forEach(curNode => {
        if (curNode.nodeType == Node.TEXT_NODE) {
          path = curNode.nodeValue + '\\' + path;
        }
      });
    });
    path = path.slice(0,-1); // to remove last '/'
    // console.log(path);

    openFile(path);
  }
}

function getParents(el) {
  var parents = [];
  var p = el.parentNode.closest('li');
  // console.log('p:'+p);
  if(p == null) return null; // if null that means that it is in root dir
  
  parents.push(el.closest('li')); // add the item itself
  while(p.parentNode.closest('li') !== null) {
      var o = p;
      parents.push(o);
      p = o.parentNode.closest('li');
  }
  parents.push(p); // Push that parentSelector you wanted to stop at
  // console.log(parents);
  return parents;
}

function openFile(path){
  // var langExt = re.exec(path)[1].slice(0,-1);

  var langExt = path.split('.').pop();
  var readOnlyAttr = false;
  // console.log(langExt);
  if(langExt == 'js'){
    langExt = 'javascript';
  }
  // if(langExt == 'php'){
  //   readOnlyAttr = true;
  // }
  var http = new XMLHttpRequest();
  var url = 'openfile.php';
  var data = 'path=' + path;
  http.open('POST', url, true);
  
  // Send request with proper path to file and get the file content
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
  http.send(data);
  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      // console.log(http.responseText)
      fileName = path; // get the name of file
      fileContent = http.responseText; // get the content of recent open file
      document.getElementById('c2').firstChild.remove(); // remove the previous opened editor
      require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
      require(['vs/editor/editor.main'], function() {
        window.monacoEditor = monaco.editor.create(document.getElementById('c2'), {
            value: [
              http.responseText
            ].join('\n'),
            language: langExt,
            readOnly: readOnlyAttr,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            autoIndent: true,
            

        });
      });
    }
  }
}

function updateFile(){
  if (fileContent !== window.monacoEditor.getValue()){

    fileContent = window.monacoEditor.getValue(); // set the fileContent variable to the new content
    var xhr = new XMLHttpRequest();
    var url = 'updatefile.php';
    var data = 'fileName='+fileName+'&fileContent='+encodeURIComponent(window.monacoEditor.getValue());
    xhr.open('POST',url);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send(data);
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        alert(xhr.responseText);
        // console.log(xhr.responseText);
      }
    }

  }else{
    // console.log(fileContent);
    alert('The file isn\'t changed');
  }
}

function doc_keyDown(e) {
  if ((e.ctrlKey || e.metaKey) && e.keyCode == 83) {
    e.preventDefault();
    document.getElementById('save-btn').click();
  }
}
// register the handler 
document.addEventListener('keydown', doc_keyDown,false);

function toggleShowing(li){
  var childUL = li.querySelector('ul');
  var arrow = li.querySelector('i');
  if(childUL.style.display == 'block'){
    childUL.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }else{
    arrow.style.transform = 'rotate(90deg)';
    childUL.style.display = 'block';
  }
}

showFirstLis();
addClickListner();
addArrowListner();
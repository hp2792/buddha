function getFile(filePath){
    //check if the path exists.
    if(fs.existsSync(filePath)){
        //reading the file with UTF-8 unicode format.
        let file = fs.readFileSync(filePath,'utf8');
        fileJsonStruct(file);
    }else{
        //throw file not exists error.
    }
}
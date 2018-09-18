function fileChooser(){
    fileDialog()
    .then(files => {
        // files contains an array of FileList
        console.log(files);
        for(let fileId in files){
            let file = files[fileId];
            if('undefined' != typeof file && null != file) getFile(file.path);
        }
        $('#hidden-file').remove();
    })

}

function folderChooser(){
    fileDialog({folder: true})
    .then(files => {
        // files contains an array of FileList
        console.log(files);
        for(let file in files){
            console.log(file);
        }
        $('#hidden-file').remove();
    })

}
const {v1: timeStamp} = require('uuid');
const path = require('path')
const upload = async (files)=>{
    const uploadedFiles = Object.keys(files);

    const saveAllFiles = await new Promise((resolve, reject) => {
        const genFileNames = []
        for(file of uploadedFiles){
            const actualFile = files[file];
            const split = actualFile.name.split('.')
            const extName = split[split.length - 1]
            const genName = `${file}-${timeStamp()}.${extName}`;
            genFileNames.push(genName);
            actualFile.mv(path.join(`${__dirname}/../../uploads/${genName}`));
            uploadedFiles.length - 1 === uploadedFiles.indexOf(file) && resolve(genFileNames);
        }
    });
    return JSON.stringify(await saveAllFiles);
}
module.exports = upload;
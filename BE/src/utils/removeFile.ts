import fs from 'fs';

export const removeFile = (id: string) => {
  try {
    const splitFolder = id.split('/data_publish/')[1];
    const splitFileName = splitFolder.split('/');
    const filePath = splitFileName[0] === 'videos' ? `${_pathFileVideo}/${splitFileName[1]}/${splitFileName[2]}` : `${_pathFileImages}/${splitFileName[1]}/${splitFileName[2]}`;
    fs.accessSync(filePath);
    fs.unlinkSync(filePath);
    return;
  } catch (error) {
    return;
  }
};

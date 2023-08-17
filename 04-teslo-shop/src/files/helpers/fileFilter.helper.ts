
export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback( new Error('File not found'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if(validExtensions.includes(fileExtension)) {
        return callback(null, true);
    }
    callback(null, false);
}
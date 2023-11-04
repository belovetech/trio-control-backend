export interface FileResponse {
  message: string;
  filePath: string;
  filename: string;
}

export interface Multer {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
}

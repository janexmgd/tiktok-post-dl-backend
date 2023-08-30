import dotenv from 'dotenv';
import streamifier from 'streamifier';
dotenv.config();
import { google } from 'googleapis';
import crypto from 'crypto';
import path from 'path';

const scopes = ['https://www.googleapis.com/auth/drive'];
const private_key = process.env.PRIVATE_KEY;
const client = new google.auth.JWT(
  process.env.EMAIL,
  null,
  private_key,
  scopes
);
const GoogleDrive = {
  uploadGD: async (file) => {
    try {
      // console.log(file.filename);
      const fileStream = streamifier.createReadStream(file.buffer);
      //   file == req.file
      const drive = google.drive({
        version: 'v3',
        auth: client,
      });
      const ext = path.extname(file.originalname);
      const filename = `${crypto
        .randomBytes(16)
        .toString('hex')}${crypto.randomInt(99)}${ext}`;

      // upload to gd
      const response = await drive.files.create({
        requestBody: {
          name: filename,
          mimeType: file.mimetype,
          parents: ['1AyBh7QuKY6FkZzZBxP71bkDg_DKyK35d'],
        },
        media: {
          mimeType: file.mimetype,
          body: fileStream,
        },
      });

      // set permission
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // get gd link
      const result = await drive.files.get({
        fileId: response.data.id,
        fields: 'webViewLink, webContentLink',
      });

      return {
        fileId: response.data.id,
      };
    } catch (error) {
      console.log(error);
    }
  },
  readerGD: async (fileID) => {
    try {
      const drive = google.drive({
        version: 'v3',
        auth: client,
      });
      const response = await drive.files.get({
        fileId: fileID,
        alt: 'media',
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  deleteGD: async (id) => {
    try {
      const drive = google.drive({
        version: 'v3',
        auth: client,
      });

      const response = await drive.files.delete({
        fileId: id,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  },
};
export default GoogleDrive;

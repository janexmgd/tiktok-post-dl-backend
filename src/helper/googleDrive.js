import dotenv from 'dotenv';
import streamifier from 'streamifier';
dotenv.config();
import { google } from 'googleapis';
import crypto from 'crypto';
import path from 'path';

const scopes = ['https://www.googleapis.com/auth/drive'];
const client = new google.auth.JWT(
  process.env.EMAIL,
  null,
  '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDB5CztsRN0NAaK\nRIykf1hKg9rfiWmIJ6QAUy75S+3gHALW2t3IucbRgp/sKqlFSflRzcne7vPjMyK7\n77SZGKNOL66CN59XiNBzc17D93Y5J5kp6Ta1hYellubLymVv4SLYhnwbUxtvqIbt\nf6tivvVU+oi6aybfohR/EfP1nXP5ghixDeZDCacksAqe6Qh1Oxnr5oqM9nZKgEJf\nsqdwVPSU7b2xK5nb7X7cZHqVAM7uiNUcgBjs8DAjTHPfYY3wQvhGDzD5wdWihUKt\n4ytQEixUZaTATvwDhHTlfleS9H14ba5DKLxoGN382W1VBUDhRMHrxBw01HZCxhPT\nvfC4hrUvAgMBAAECggEAGOFIaUvSsj5Gzzv9TCfR0uYD57FWAGm4dW43KzhKEvr6\nhkrZhiYIqYkjL7FIZ/gWbR/aFVMBABjnY8mzmVL8XvkRYeufSnfnlRkAgmcLyEkY\n3LRCF/LwNW3ID0MugbfDD+6EmGuxVpeqkL6pkGdD9fPxfZ0TBO64cJcuK0iuwXJt\n/69ufYi5HJyMaVLZBz8SUiePOf9fYmCpkSh+gbGcmioWXBYwcKestfMdI+00s8nh\nKmeDnoJnjugQIJp4CbpeGFPXB4FZnivHj9scBwvfTfjEaLG8/JWsdALEyDw+8y6Q\nUnzRAkW2ukqY3RbvYKM62P+3UGKzv/a3xaGecB/DUQKBgQDqykeZleDjSUzN0m88\nnYleJAd9hVPcmi8p79dmRn7qjvbFhYgMGxvMhSl7y2zMpH+CTY7ZvbqZuvyoqxza\nCTeZAVOnWvuYEuOrUAh10xgJdezaJtPpqH0GajQXjkJn5hGtGwuc36a2OyTaVzLS\n4178Vjs+aC/2oX+xJwOATCHvCQKBgQDTaBNXOvpkx3BQ/DCA51kfUQMpraSbpQL0\nZmr3odTflcIGxEtzfLqZ2NgW1a7mWCnoNHaWqVQRNTE1ovmQiLcYmoHxM3KVnIlM\nFipOVBkAxQAkOXwylTuTfMPHCO+ubydd1pvA4OqXNjQ1kSSd4Otbs+sE+/Uxpl/0\nNAmYHcnYdwKBgCmnh3plD8fjGkAtxFRhspxEEhwfylgJ9rIe/f0EJsIgaQF0BkX3\njUAEo+51kbDgwkpwzhYtRey+MtMNwImiNv3rMVcwmhBJ0aB0C3wz3kDXbhTp7JC4\ntq2rq+A9+eQK+jnW4YGMYDxWU9x0ueyWMCTee5Y/z7qWvlvEiyd42lBZAoGALrIy\nc3YnkNMsz/akkBSJ7wzp8e7VCTwtpuZogkJQzwI5VV1OfTfzz7/CG2kftOmMeCn+\nd9D3LMXfFMXm8jIAn4KhaTHAAaQN/6x1s8+Hpk/ddCLueA3WlwFcDT7AEnui6mtZ\nBAWqS7RBXAOvXuArnJnlM7ijtE/Xqg1EgUEzMIkCgYBp60CFXZr8fw03J6uXsCpX\n01oiKHW5Ksfo/I33B72z6BTpu/pz6oFUmjgMVNALR35hW+Y8YECZEU+5pp2d7aaz\n4fBHWX7eijXN8fPtTh5MyqkrLQsTolbofsxE26mRacF4kPeKqY7eFMV04gpB4EZ1\n5x6S9vAuIVhlMoBfz9TjgQ==\n-----END PRIVATE KEY-----\n',
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

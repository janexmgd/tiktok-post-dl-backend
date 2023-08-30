import response from '../helper/response.js';
import parsers from '../helper/parser.js';
import GoogleDrive from '../helper/googleDrive.js';
const { uploadGD, readerGD, deleteGD } = GoogleDrive;
const { success, failed } = response;
const tiktokdlController = {
  single: async (req, res, next) => {
    try {
      const { url } = req.body;
      const data = await parsers(url);

      success(res, {
        code: 200,
        status: 'success',
        message: 'Success get url',
        data: data,
      });
      return;
    } catch (error) {
      return failed(res, {
        code: error.code || 500,
        status: 'error' || 'failed',
        message: error.message || 'internal server error',
      });
    }
  },
  multi: async (req, res, next) => {
    try {
      if (req.file) {
        const fileatGD = await uploadGD(req.file);
        // console.log(fileatGD.fileId);
        const listFromGD = await readerGD(fileatGD.fileId);
        if (!listFromGD.split('\n')) {
          throw new Error('invalid list format');
        }
        const urlListSplit = listFromGD.split('\n');
        const urlList = [];
        for (const url of urlListSplit) {
          try {
            urlList.push(url);
          } catch (error) {
            console.log(error);
          }
        }
        const data = [];
        const promises = [];

        for (const url of urlList) {
          promises.push(
            parsers(url).then((dataPerIndex) => {
              data.push(dataPerIndex);
            })
          );
        }

        await Promise.all(promises);
        await deleteGD(fileatGD.fileId);
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success get data',
          data: data,
        });
      } else {
        throw new Error('need list of file');
      }
    } catch (error) {
      return failed(res, {
        code: error.code || 500,
        status: 'error' || 'failed',
        message: error.message || 'internal server error',
      });
    }
  },
};
export default tiktokdlController;

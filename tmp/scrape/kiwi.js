import { createWebFolder, startUpload } from "@file-kiwi/node";

class FileKiwiUploader {
  async upload(filePath, title = "Erine-MD Upload") {
    try {
      const webfolder = await createWebFolder({
        title: title,
        files: [
          {
            filepath: filePath
          }
        ]
      });

      await startUpload(webfolder);

      return {
        success: true,
        url: webfolder.webfolderUrl
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new FileKiwiUploader();
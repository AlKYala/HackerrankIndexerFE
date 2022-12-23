/**
 * A class to wrap JSZip
 * This is used when downloading submissions
 */
import JSZip from "jszip";

export class Zip {

  private zipFile: JSZip;
  private zipFileName: string;
  private folders: {[key:string]: any};
  private fileNames: {[key:string]: any};

  constructor(zipFileName: string) {
    this.zipFileName = zipFileName;
    this.zipFile = new JSZip();
    this.folders = {};
    this.fileNames = {};
  }

  public fireDownload() {
    const fileName = this.zipFileName;
    this.zipFile.generateAsync({type: "blob"})
      .then(function (zip: Blob)  {
        let a = document.createElement("a");
        a.setAttribute("style", "display: none");
        a.download = fileName;
        const blobUrl = window.URL.createObjectURL(zip);
        a.setAttribute("href", blobUrl);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
    })
  }

  public addFile(data: any, isBase64: boolean, fileName: string, folderName?: string) {
    fileName = this.formatFileName(fileName);
    if(folderName != null) {
      this.addFileToFolder(data, isBase64, fileName, folderName);
      return;
    }
    this.addFileInRootDirectory(data, isBase64, fileName);
  }

  private addFileInRootDirectory(data: any, isBase64: boolean, fileName: string) {
    this.zipFile.file(fileName, data, {base64: isBase64});
  }

  private addFileToFolder(data: any, isBase64: boolean, fileName: string, folderName: string) {
    const folder = this.getFolder(folderName);
    folder.file(fileName, data, {base64: isBase64});
  }

  private getFolder(folderName: string) {
    if(this.folders[folderName] == undefined) {
      this.folders[folderName] = this.zipFile.folder(folderName)!;
    }
    return this.folders[folderName];
  }

  private formatFileName(fileName: string): string {
    if(this.fileNames[fileName] == undefined) {
      this.fileNames[fileName] = -1;
    }
    this.fileNames[fileName]++;
    let formatted = `${this.fileNames[fileName]}_${fileName}`;
    return formatted.trim();
  }
}

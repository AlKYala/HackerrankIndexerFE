/**
 * A class to wrap JSZip
 * This is used when downloading submissions
 */
import JSZip from "jszip";

export class Zip {

  private zipFile: JSZip;
  private zipFileName: string;
  private folders: {[key:string]: any};

  constructor(zipFileName: string) {
    this.zipFileName = zipFileName;
    this.zipFile = new JSZip();
    this.folders = {};
  }

  public fireDownload() {
    this.zipFile.generateAsync({type: "blob"})
      .then(function (zip: Blob)  {
        const url = window.URL.createObjectURL(zip);
        window.open(url);
    })
  }

  public addFile(data: any, isBase64: boolean, fileName: string, folderName?: string) {
    if(folderName != undefined) {
      this.addFileToFolder(data, isBase64, fileName, folderName);
      return;
    }
    this.addFileInRootDirectory(data, isBase64, fileName);
  }

  private addFileInRootDirectory(data: any, isBase64: boolean, fileName: string) {
    this.zipFile.file(fileName, data, {base64: isBase64});
  }

  private addFileToFolder(data: any, isBase64: boolean, fileName: string, folderName: string) {
    const folder = this.folders[folderName];
    folder.file(fileName, data, {base64: isBase64});
  }

  private getFolder(folderName: string) {
    if(this.folders[folderName] == undefined) {
      this.folders[folderName] = this.zipFile.folder(folderName)!;
    }
    return this.folders[folderName];
  }

}

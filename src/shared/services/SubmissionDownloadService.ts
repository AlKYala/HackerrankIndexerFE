import {Injectable} from "@angular/core";
import {Submission} from "../datamodels/Submission/model/Submission";
import {formatDate} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {DownloadFile} from "../datamodels/DownloadFile/Model/DownloadFile";
import {RequestService} from "./ServiceHandler/RequestService";
import {CollectionWrapper} from "../datamodels/shared/collectionWrapper";
import JSZip from "jszip";
import {Zip} from "../datamodels/Zip/model/Zip";

@Injectable({providedIn: 'root'})
export class SubmissionDownloadService {

  constructor(private requestService: RequestService) {
  }

  public generateAndDownloadSubmission(submission: Submission) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    const blob = new Blob([this.generateFileContents(submission)], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    const extension: string = this.findExtensionForFile(submission);
    const fileName: string = `${submission.challenge.challengeName.replace(/\s/g, "")}.${extension}`;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateFileContents(submission: Submission): string {
    return `${this.generateDocumentInfo(submission)}\n${submission.code}`;
  }

  private generateDocumentInfo(submission: Submission): string {
    return `/**\nPowered by HackerrankIndexer by Ali Yalama 2021\n
    https://github.com/AlKYala/HackerRankIndexer\n
    File created: ${this.getCurrentDateAsString()}\n
    Challenge name: ${submission.challenge.challengeName}\n*/\n`;
  }

  private getCurrentDateAsString(): string {
    return formatDate(new Date(), "dd/MM/yyyy", 'en');
  }

  //TODO delegate to backend
  private findExtensionForFile(submission: Submission): string {
    const language: string = submission.language.language;
    let extension: string = "txt";
    console.log(language);
    if(language.includes('java')) {

      extension = 'java';
    }
    else if(language.includes('cpp')) {
      extension = 'cpp';
    }
    else if(language.includes('sql')) {
      extension = 'sql';
    }
    else if(language.includes('py')) {
      extension = 'py';
    }
    return extension;
  }

  public getDownloadFilesBySubmissions(submissions: Submission[]) {
    const numbers: number[] = [];
    for(let submission of submissions) {
      numbers.push(submission.id!);
    }
    return this.getDownloadFilesBySubmissionIds(numbers);
  }

  public getDownloadFilesBySubmissionIds(numbers: number[]) {
    const collectionWrapper: CollectionWrapper<number> = {collection: numbers};
    this.requestService
      .anyPostRequest(`${environment.api}/downloadSubmissions`, collectionWrapper)
      .subscribe((data: DownloadFile[]) => {
        this.downloadSubmissions(data);
      })
  }

  public downloadSubmissions(downloadFiles: DownloadFile[]) {
    console.log(downloadFiles);
    const zip = new Zip("submissions.zip");
    for(const downloadFile of downloadFiles) {
      zip.addFile(downloadFile.base64, true, downloadFile.fileName, downloadFile.challengeName);
    }
    zip.fireDownload();
    //fire download
  }

  private downloadFileInstanceToBlob(downlaodFile: DownloadFile): Blob {
    const bytesCharacterValues = atob(downlaodFile.base64);
    const byteNumberValues = new Array(bytesCharacterValues.length);
    for(let i = 0; i < bytesCharacterValues.length; i++) {
      byteNumberValues[i] = bytesCharacterValues.charCodeAt(i);
    }

    const bytes = new Uint8Array(byteNumberValues);
    const blob = new Blob([bytes], {type: 'application/json'});
    return blob;
  }
}

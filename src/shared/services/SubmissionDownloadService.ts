import {Injectable} from "@angular/core";
import {Submission} from "../datamodels/Submission/model/Submission";
import {formatDate} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {DownloadFile} from "../datamodels/DownloadFile/Model/DownloadFile";

@Injectable({providedIn: 'root'})
export class SubmissionDownloadService {

  constructor(private httpClient: HttpClient) {
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

  public getDownloadFilesBySubmissionIds(numbers: number[]): Observable<DownloadFile[]> {
    return this.httpClient.post(`${environment.api}/downloadSubmissions`, numbers) as Observable<DownloadFile[]>;
  }
}

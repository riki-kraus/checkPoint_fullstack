import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exam } from '../../models/Exam';
import { Submission } from '../../models/Submission';


@Injectable({
  providedIn: 'root'
})
export class SubmissionService {


  constructor(private http: HttpClient) {}
 
  private submissionsSubject = new BehaviorSubject<Submission[]|undefined >([]);
  public submissions$ = this.submissionsSubject.asObservable();
  
  
  getSubmissionByStudentId(studentId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`/Submission/StudentId/${studentId}`);

  }


  LoadSubmmisionById(studentId: number): void {
    this.getSubmissionByStudentId(studentId).subscribe((submissions: Submission[]) => {
      this.submissionsSubject.next(submissions);
    });
  }

  getAllSubjects(): Observable<any[]> {
    return this.http.get<Exam[]>(`/Exam`);
  }

}

import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { FormsModule } from '@angular/forms';

interface ExamSection {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface Document {
  name: string;
  type: string;
  size: string;
  icon: string;
}

interface PerformanceArea {
  name: string;
  type: 'strength' | 'improvement';
}

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results1.component.css', './exam-results2.component.css'],
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ transform: 'translateY(50px)', opacity: 0 }),
          stagger(200, [
            animate('0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              style({ transform: 'translateY(0)', opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ]),

    trigger('progressBar', [
      transition(':enter', [
        style({ width: '0%' }),
        animate('1.2s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ width: '{{ width }}%' }))
      ])
    ]),

    trigger('scoreAnimation', [
      transition(':enter', [
        animate('1.5s cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
          style({ transform: 'scale(0.8)', opacity: 0, offset: 0 }),
          style({ transform: 'scale(1.1)', opacity: 0.7, offset: 0.7 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1 })
        ]))
      ])
    ]),

    trigger('fadeInScale', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('buttonHover', [
      state('idle', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('idle <=> hover', animate('0.2s cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class ExamResultsComponent implements OnInit {
  activeTab = signal<'overview' | 'feedback' | 'documents'>('overview');
  showAppealDialog = signal(false);
  appealText = signal('');
  buttonState = signal<'idle' | 'hover'>('idle');

  examInfo = signal({
    title: 'Mathematics - Calculus Final',
    date: 'December 15, 2023',
    instructor: 'Dr. Sarah Johnson',
    totalScore: 92,
    maxScore: 100
  });

  sections = signal<ExamSection[]>([
    { name: 'Multiple Choice', score: 28, maxScore: 30, percentage: 93 },
    { name: 'Short Answer', score: 24, maxScore: 25, percentage: 96 },
    { name: 'Problem Solving', score: 40, maxScore: 45, percentage: 89 }
  ]);

  documents = signal<Document[]>([
    { name: 'Calculus_Final_Feedback.docx', type: 'Word Document', size: '245 KB', icon: '📄' },
    { name: 'Calculus_Final_Graded.pdf', type: 'PDF Document', size: '1.2 MB', icon: '📋' }
  ]);

  strengths = signal<PerformanceArea[]>([
    { name: 'Derivatives', type: 'strength' },
    { name: 'Integration', type: 'strength' },
    { name: 'Limits', type: 'strength' }
  ]);

  improvements = signal<PerformanceArea[]>([
    { name: 'Application problems', type: 'improvement' },
    { name: 'Series convergence', type: 'improvement' }
  ]);

  gradeClass = computed(() => {
    const score = this.examInfo().totalScore;
    if (score >= 90) return 'grade-excellent';
    if (score >= 80) return 'grade-good';
    if (score >= 70) return 'grade-average';
    return 'grade-needs-improvement';
  });

  ngOnInit() {
  }

  setActiveTab(tab: 'overview' | 'feedback' | 'documents') {
    this.activeTab.set(tab);
  }

  openAppealDialog() {
    this.showAppealDialog.set(true);
  }

  closeAppealDialog() {
    this.showAppealDialog.set(false);
    this.appealText.set('');
  }

  submitAppeal() {
    if (this.appealText().trim()) {
      this.closeAppealDialog();
    }
  }

  downloadDocument(document: Document) {
  }

  viewDocument(document: Document) {
  }

  onButtonHover(state: 'idle' | 'hover') {
    this.buttonState.set(state);
  }
}
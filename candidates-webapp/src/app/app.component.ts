import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CandidateListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Candidates Management';
}
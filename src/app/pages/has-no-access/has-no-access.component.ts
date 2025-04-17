import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-has-no-access',
  imports: [CommonModule, RouterModule],
  templateUrl: './has-no-access.component.html',
  styleUrl: './has-no-access.component.scss',
})
export class HasNoAccessComponent {}

import { EventEmitter } from '@angular/core';
import { FlightFilter } from './../../../../domain/src/lib/entities/flight-filter';
import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'flight-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.css'],
})
export class FlightFilterComponent {
  @Input() set filter(value: FlightFilter) {
    this.filterForm.setValue(value);
  }

  @Output() searchTrigger = new EventEmitter<FlightFilter>();

  filterForm = this.fb.group({
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
    urgent: [false],
  });

  constructor(private fb: NonNullableFormBuilder) {}

  search(): void {
    this.searchTrigger.emit(this.filterForm.getRawValue());
  }
}

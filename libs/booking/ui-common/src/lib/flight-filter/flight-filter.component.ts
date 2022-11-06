import { filter, map, Observable, tap } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { FlightFilter } from './../../../../domain/src/lib/entities/flight-filter';
import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';

export interface LocalState {
  filters: FlightFilter[];
}
export const initialLocalState: LocalState = {
  filters: [],
};

@Component({
  selector: 'flight-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.css'],
  providers: [ComponentStore],
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

  selectedFilter = this.fb.control(this.filterForm.getRawValue());

  selectFilters$ = this.localStore.select((state) => state.filters);
  selectLastFilter$ = this.localStore.select(
    this.selectFilters$,
    (filters) => filters[filters.length - 1]
  );

  addFilter = this.localStore.updater((state, filterToAdd: FlightFilter) => {
    const allFilters = [...state.filters, filterToAdd];

    const equalToFilter = (baseFilter: FlightFilter, f: FlightFilter) =>
      baseFilter.from === f.from && baseFilter.to === f.to;

    const uniqueFilters = allFilters.filter((filter, index, all) => {
      return all.findIndex((f) => equalToFilter(filter, f)) === index;
    });

    return {
      ...state,
      filters: uniqueFilters,
    };
  });

  triggerSearch = this.localStore.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      map(() => this.filterForm.getRawValue()),
      tap((filter: FlightFilter) => this.addFilter(filter)),
      tap((filter: FlightFilter) => this.searchTrigger.emit(filter))
    )
  );

  updateFilterForm = this.localStore.effect(
    (trigger$: Observable<FlightFilter>) =>
      trigger$.pipe(
        tap((filter: FlightFilter) => this.filterForm.setValue(filter))
      )
  );

  updateSelectedFilter = this.localStore.effect(
    (trigger$: Observable<FlightFilter | undefined>) =>
      trigger$.pipe(
        filter(Boolean),
        tap((filter: FlightFilter) => this.selectedFilter.setValue(filter))
      )
  );

  constructor(
    private fb: NonNullableFormBuilder,
    private localStore: ComponentStore<LocalState>
  ) {
    this.localStore.setState(initialLocalState);

    this.updateFilterForm(this.selectedFilter.valueChanges);
    this.updateSelectedFilter(this.selectLastFilter$);
  }
}

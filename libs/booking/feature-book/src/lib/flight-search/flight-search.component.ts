import { FlightFilter } from './../../../../domain/src/lib/entities/flight-filter';
import { CommonModule } from "@angular/common";
import { Component, inject, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BookingSlice, delayFlight, loadFlights, selectFlights } from "@nx-example/booking/domain";
import { take } from "rxjs";

import { FlightCardComponent, FlightFilterComponent } from '@nx-example/booking/ui-common';
import { CityValidator } from '@nx-example/shared/util-common';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FlightCardComponent,
    CityValidator,
    FlightFilterComponent
  ],
  providers: [
  ],
  selector: 'flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  filter: FlightFilter = {
    from: 'Berlin',
    to: 'London',
    urgent: false
}; 

  store = inject(Store<BookingSlice>);
  flights$ = this.store.select(selectFlights);

  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  search(filter: FlightFilter): void {
    this.filter = filter;

    if (!this.filter.from || !this.filter.to) return;

    this.store.dispatch(loadFlights({
        from: this.filter.from,
        to: this.filter.to
    }));
  }

  delay(): void {
    this.flights$.pipe(take(1)).subscribe(flights => {
      const id = flights[0].id;
      this.store.dispatch(delayFlight({id}));
    });
  }

}


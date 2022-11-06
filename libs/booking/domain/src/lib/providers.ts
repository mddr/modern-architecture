import { provideEffects } from '@ngrx/effects';
// libs/booking/domain/src/lib/domain.providers.ts

import { provideState } from '@ngrx/store';
import { BookingEffects } from './+state/effects';
import { bookingFeature } from './+state/reducers';

export function provideBookingDomain() {
  return [provideState(bookingFeature), provideEffects([BookingEffects])];
}

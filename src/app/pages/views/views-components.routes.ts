import { Routes } from '@angular/router';

// ui
import { AppBookingsComponent } from './bookings/bookings.component'
import { AppDoctorsComponent } from './doctors/doctors.component'
import { AppDepartmentsComponent } from './departments/departments.component'
import {AppPatientsComponent} from './patients/patients.component'
import { AppSettingsComponent } from './settings/settings.component';
import { AppFeedbacksComponent } from './feedbacks/feedbacks.component';

export const ViewsComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'bookings',
        component: AppBookingsComponent,
      },
      {
        path: 'doctors',
        component: AppDoctorsComponent,
      },
      {
        path: 'departments',
        component: AppDepartmentsComponent,
      },
      {
        path: 'patients',
        component: AppPatientsComponent,
      },
      {
        path: 'settings',
        component: AppSettingsComponent,
      },
      {
        path: 'feedbacks',
        component: AppFeedbacksComponent,
      }
    ],
  },
];

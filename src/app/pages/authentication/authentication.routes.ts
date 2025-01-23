import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { AppSideForgotComponent } from './side-forgot/side-forgot.component';
import { AppSideResetComponent } from './side-reset/side-reset.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'forgot-password',
        component: AppSideForgotComponent,
      },
      {
        path: 'reset-password',
        component: AppSideResetComponent,
      },
    ],
  },
];

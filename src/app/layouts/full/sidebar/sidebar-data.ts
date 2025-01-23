import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-5-bold',
    route: '/dashboard',
  },
  {
    displayName: 'Bookings',
    iconName: 'solar:box-bold',
    route: '/views/bookings',
  },
  {
    displayName: 'Doctors',
    iconName: 'solar:medical-kit-bold',
    route: '/views/doctors',
  },
  {
    displayName: 'Departments',
    iconName: 'solar:buildings-3-bold',
    route: '/views/departments',
  },
  {
    displayName: 'Patients',
    iconName: 'solar:users-group-rounded-bold',
    route: '/views/patients',
  },
  {
    displayName: 'Feedbacks',
    iconName: 'solar:cup-star-bold',
    route: '/views/feedbacks',
  },
  {
    navCap: 'General',
    divider: true
  },
  {
    displayName: 'Settings',
    iconName: 'solar:settings-minimalistic-bold',
    route: '/views/settings',
  }
];

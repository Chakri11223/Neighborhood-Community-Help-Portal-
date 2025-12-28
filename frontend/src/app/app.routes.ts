import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { HelpRequestComponent } from './components/help-request/help-request.component';
import { RequestStatusComponent } from './components/request-status/request-status.component';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegistrationComponent
    },
    {
        path: 'requests',
        component: RequestListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'requests/new',
        component: HelpRequestComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Resident' } // Only Residents can create
    },
    {
        path: 'requests/:id',
        component: RequestStatusComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: 'chat/:id',
        component: ChatComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

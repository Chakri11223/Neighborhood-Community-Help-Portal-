import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HelpRequestComponent } from './components/help-request/help-request.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestStatusComponent } from './components/request-status/request-status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'register', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
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
        data: { role: 'Resident' }
    },
    {
        path: 'requests/:id/status',
        component: RequestStatusComponent,
        canActivate: [authGuard]
    },
    {
        path: 'chat/:id',
        component: ChatComponent,
        canActivate: [authGuard]
    }
];

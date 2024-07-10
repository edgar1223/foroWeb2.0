import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {DashComponent}from './dash/dash.component';
import{authGuard}from './guard/auth.guard';
import{authLoginGuard}from './guard/auth-login.guard';
import {PostFormComponent}from './post-form/post-form.component'
import {PostDetailComponent} from './post-detail/post-detail.component'
import {EditProfileComponent} from './edit-profile/edit-profile.component'
import {ProfesorComponent} from "./profesor/profesor.component"
const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authLoginGuard]},
  { path: 'inicio', component: DashComponent , canActivate: [authGuard]},
  { path: 'crearPost', component: PostFormComponent , canActivate: [authGuard]},
  { path: 'post/:id', component: PostDetailComponent , canActivate: [authGuard]},
  { path: 'Perfil', component:EditProfileComponent , canActivate: [authGuard]},
  { path: 'profesor', component:ProfesorComponent , canActivate: [authGuard]},

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

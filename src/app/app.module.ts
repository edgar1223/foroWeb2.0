import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashComponent } from './dash/dash.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { PostFormComponent } from './post-form/post-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProfesorComponent } from './profesor/profesor.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputNumberModule } from 'primeng/inputnumber';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { GalleriaModule } from 'primeng/galleria';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartModule } from 'primeng/chart';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashComponent,
    MenuComponent,
    PostFormComponent,
    PostDetailComponent,
    EditProfileComponent,

    ProfesorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    MultiSelectModule,
    MatFormFieldModule,
    InputNumberModule,
    MatCardModule,
    CardModule,
    MatChipsModule,
    ListboxModule,
    GalleriaModule,
    MatGridListModule,
    ChartModule,
    MatIconModule,
    FileUploadModule,
    ImageModule,
    DialogModule,
    MessagesModule,MessageModule
  ],
  providers: [provideClientHydration(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}

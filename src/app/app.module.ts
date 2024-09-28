import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { ProjectStatisticsComponent } from './project-statistics/project-statistics.component';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms'; // Import the FormsModule
import { DialogModule } from 'primeng/dialog'; // Import DialogModule
import { DropdownModule } from 'primeng/dropdown'; // Import DropdownModule
import { ProjectService } from './project-management/service/ProjectService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { LoginComponent } from './login/login.component';
import { RegisterManagerComponent } from './register-manager/register-manager.component';
import { RegisterTranslatorComponent } from './register-translator/register-translator.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AuthGuard } from './login/guard/AuthGuard';
import { AuthService } from './login/service/AuthService';
import { AuthInterceptor } from './login/interceptor/AuthInterceptor';


@NgModule({
  declarations: [
    AppComponent,
    ProjectManagementComponent,
    TaskManagementComponent,
    ProjectStatisticsComponent,
    LoginComponent,
    RegisterManagerComponent,
    RegisterTranslatorComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenuModule,
    DropdownModule,
    ToastModule,
    ToolbarModule,
    InputTextareaModule,
    TableModule,
    CalendarModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    TagModule,
    RatingModule,
    InputTextModule,
    FileUploadModule,
    RadioButtonModule,
    AppRoutingModule
  ],
  providers: [ProjectService,MessageService,ConfirmationService,AuthService,
    AuthGuard,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from 'src/environments/environment';
import { LoginComponent } from './auth/login/login.component';
import { AuthenticationService } from './auth/services/authentication.service';
import { PainelComponent } from './painel/painel.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DepartamentoModule } from './departamentos/departamento.module';
import { EquipamentoModule } from './equipamentos/equipamento.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PainelComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,

    DepartamentoModule,
    EquipamentoModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
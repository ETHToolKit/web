import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CdkTableModule} from '@angular/cdk/table';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import { EthereumService } from './services/ethereum.service';
import { HelperService } from './services/helper.service';
import { NormalizerPipe } from './pipes/normalizer.pipe';
import { DataImporterComponent } from './components/controls/dataImporter/dataImporter.component';
import { DropperContextService } from './services/dropperContext.service';
import { AirdropDataService } from './services/airdropData.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HomeComponent } from './components/home/home.component';
import { TokenInfoComponent } from './components/controls/tokenInfo/tokenInfo.component';
import { DropConfigComponent } from './components/controls/dropConfig/dropConfig.component';
import { ContextWorkerService } from './services/contextWorker.service';
import { OnlyNumber } from './directives/onlyNumber.directive';
import { DropperFaq } from './components/dropperFaq/dropperFaq.component';
import { DropPackageComponent } from './components/controls/dropPackage/dropPackage.component';
import { DropperComponent } from './components/dropper/dropper.component';
import { TermsComponent } from './components/terms/terms.component';
import { CreatorComponent } from './components/creator/creator.component';
import { NetworkGuard } from './services/network.guard';
import { EtherscanService } from './services/etherscan.service';



const appRoutes: Routes = [
  { path: 'dropper', component: DropperComponent , canActivate: [NetworkGuard]},
  { path: 'home', component: HomeComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'creator', component: CreatorComponent , canActivate: [NetworkGuard]},
  { path: 'dropperFaq', component: DropperFaq },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: HomeComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    DropperComponent,
    NormalizerPipe,
    DataImporterComponent,
    HomeComponent,
    OnlyNumber,
    TokenInfoComponent,
    DropConfigComponent,
    DropPackageComponent,
    TermsComponent,
    DropperFaq,
    CreatorComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    EthereumService,
    DropperContextService,
    AirdropDataService,
    HelperService,
    ContextWorkerService,
    NetworkGuard,
    EtherscanService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }

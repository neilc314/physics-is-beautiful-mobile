import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { DiscussionPage } from '../pages/discussion/discussion';
import { HTTP } from '@ionic-native/http';
import { GlobalSettingsProvider } from '../providers/global-settings/global-settings';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DiscussionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    DiscussionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    GooglePlus,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalSettingsProvider
  ]
})
export class AppModule {}

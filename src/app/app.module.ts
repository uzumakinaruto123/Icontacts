import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Contacts } from '../pages/contacts/contacts';
import { AddContacts } from '../pages/add-contacts/add-contacts';
import { ContactsProvider } from '../providers/contacts-provider';

import { Toast } from '@ionic-native/toast';

@NgModule({
  declarations: [
    MyApp,
    Contacts,
    AddContacts
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Contacts,
    AddContacts
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ContactsProvider,
    Toast,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

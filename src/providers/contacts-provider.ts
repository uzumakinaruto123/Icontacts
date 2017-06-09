import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';

/*
  Generated class for the ContactsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactsProvider {

  public allContacts = [];

  constructor(
    private storage: Storage,
    private toast: Toast) {

    console.log('Hello ContactsProvider Provider');
  }

  getContacts(){
    return this.storage.get('contacts').then((val) => {
      if(val && val.length){
        this.allContacts = val;
      }
      return true;
    });
  }

  checkForDuplicate(contact: any){
    return this.storage.get('contacts').then((val) => {
      if(val && val.length){
        console.log(val);
        for(var i=0; i < val.length; i++){
          if(contact.number == val[i].number){
            return true;
          }
        }
        return false;
      }
    });
  }

  addNewContact(contact: any){
          return this.storage.get('contacts').then((val) => {

              let temp = [];
              if(val && val.length){
                temp = val;
              }

              temp.push(contact);

              return this.storage.set('contacts', temp).then((newC) => {
                this.allContacts = newC;
                return true;
              }).catch(() => {
                return false;
              })
          });
  }

  updateDetails(index: any, newValue:any){
    return this.storage.get('contacts').then((contacts) => {
        contacts[index] = newValue;
        return this.storage.set('contacts',contacts).then((newContacts) => {
          this.allContacts = newContacts;
          return true;
        }).catch((err) => {
          return false;
        });
    }).catch((err) => {
      return false;
    });
  }

  deleteAll(){
    return this.storage.remove('contacts').then(() => {
      this.allContacts = [];
      return true;
    });
  }

  removeContact(index: number){
        return this.storage.get('contacts').then((val) => {
                  val.splice(index,1);
                  this.storage.set('contacts',val).then((newValue) => {
                    this.allContacts = newValue;
                    return;
                  });
        });
  }

  showToast(msg ,duration ,position){
      this.toast.show(msg ,duration ,position).subscribe(
        toast => {
          console.log(toast);
        }
      );
  }

}

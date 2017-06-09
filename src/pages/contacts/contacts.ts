import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AddContacts } from '../add-contacts/add-contacts';
import { ContactsProvider } from '../../providers/contacts-provider';

/**
 * Generated class for the Contacts page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class Contacts {

  public searchString = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public cp: ContactsProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Contacts');
  }

  ngOnInit(){
    this.cp.getContacts();
  }

  doRefresh(refresher){
    this.cp.getContacts().then(() => {

      if(this.searchString && this.searchString.length){
        this.getItems({target: { value: this.searchString}});
      }
      setTimeout(() =>{
       refresher.complete();
      },2000)
    });
  }

  getItems(ev: any){
      this.cp.getContacts().then(() => {

      let val = ev.target.value;

      if (val && val.trim() != '') {
        this.cp.allContacts = this.cp.allContacts.filter((item) => {
          console.log(item.number.indexOf(val) > -1);
          return (item.number.substring(0, val.length) == val);
        })
      }
      });

    
  }

  addContact(){
    let modal = this.modalCtrl.create(AddContacts);
    modal.onDidDismiss(() => {
      this.cp.getContacts();
    });
    modal.present();
  }

  deleteContact(index: number){
    this.cp.removeContact(index);
  }

  deleteAll(){
    let confirm = this.alertCtrl.create({
      title: 'Delete all contacts?',
      message: 'Contacts will be deleted permanently',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.cp.deleteAll().then(() => {
              this.cp.showToast("Contact deleted successfully!",2000,'bottom');
            });
          }
        }
      ]
    });

    if(this.cp.allContacts.length){
      confirm.present();
    }else{
      this.cp.showToast("No contacts to delete!",2000,'bottom');
    }
  }

  updatePrompt(contact: any, index: number) {
    let prompt = this.alertCtrl.create({
      title: 'Update',
      message: "Update contact details",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'First Name',
          type: 'text',
          value: contact.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Last Name',
          type: 'text',
          value: contact.lastName
        },
        {
          name: 'number',
          placeholder: 'Number',
          type: 'number',
          value: contact.number
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            
            if(data.firstName.length == 0 || data.lastName.length == 0 || data.number.length != 10){
              this.cp.showToast("Invalid Details!",2000,'bottom');
              console.log('Invalid Details!');
              return false;
            }

            if(contact.number == data.number){
               return this.cp.updateDetails(index,data).then(()=> {
                  this.cp.showToast("Contact updated!",2000,'bottom');
                });
            }else{
                return this.cp.checkForDuplicate(data).then((res) => {
                    if(res){
                      this.cp.showToast("Contact number already exists!",2000,'bottom');
                      console.log('dup');
                      return false;
                    }else{
                      return this.cp.updateDetails(index,data).then(()=> {
                        this.cp.showToast("Contact updated!",2000,'bottom');
                        return true;
                      });
                    }
                });
            }
          }
        }
      ]
    });
    prompt.present();
  }

}

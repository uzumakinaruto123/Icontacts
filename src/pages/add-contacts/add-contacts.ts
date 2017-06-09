import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ContactsProvider } from '../../providers/contacts-provider';

/**
 * Generated class for the AddContacts page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-contacts',
  templateUrl: 'add-contacts.html',
})
export class AddContacts {

  public cotactsToAdd = [{ name : '', number : ''}];

  public myForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private _fb: FormBuilder,
    public cp: ContactsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddContacts');
  }

  ngOnInit(){
      this.myForm = this._fb.group({
              cotactsToAdd: this._fb.array([
                  this.initContact(),
              ])
          });
    }

  initContact() {
        return this._fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            number: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
        });
    }

  addContact() {
      const control = <FormArray>this.myForm.controls['cotactsToAdd'];
      control.push(this.initContact());
  }

  removeContact(i: number) {
      const control = <FormArray>this.myForm.controls['cotactsToAdd'];
      control.removeAt(i);
  }

  loopArray (arr,x) {
      this.customADD(arr[x],(val) => {
          x++;
          if(x < arr.length) {
              this.loopArray(arr,x);   
          }else{
            if(val){
                this.cp.showToast("Contacts added successfully",2000,'bottom');
            }
            this.viewCtrl.dismiss();
          }
      }); 
  }

customADD(element,callback) {
    this.cp.checkForDuplicate(element).then((res) => {
        if(res){
          this.cp.showToast("Duplicate contact found, will be Ignored!",2000,'bottom');
          callback(false);
        }else{
          this.cp.addNewContact(element);
          callback(true);
        }
    });
}

  save(model: any) {
        let newContacts = model._value.cotactsToAdd;
        var x = 0;
        this.loopArray(newContacts,x);
    }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}

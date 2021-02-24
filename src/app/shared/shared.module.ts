import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule
  ],
  exports: [CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule]
})
export class SharedModule { }

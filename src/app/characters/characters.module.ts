
import { NgModule,  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharactersRoutingModule } from './characters-routing.module';
import { charactersComponent } from './characters.component';

import { MaterialModule } from '../material.module';



@NgModule({
    imports: [
      CommonModule,
      CharactersRoutingModule,
      MaterialModule,   //Material UI
    ],
    declarations: [charactersComponent]
  })
  export class CharactersModule { }

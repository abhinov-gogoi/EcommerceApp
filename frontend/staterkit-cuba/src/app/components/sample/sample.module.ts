import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { SampleRoutingModule } from './sample-routing.module';
import { SampleComponent } from './sample.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SampleRoutingModule
  ],
  declarations: [SampleComponent]
})
export class SampleModule { }

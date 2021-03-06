import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {RequestFormComponent} from "./request-form/request-form.component";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InlineEditorModule} from 'ng2-inline-editor';
import {DateParseModule} from "../../util/date-parser/date-parse.module";

@NgModule({
  imports: [
    DateParseModule,
    InlineEditorModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2Bs3ModalModule,
  ],
  declarations: [
    RequestFormComponent,
  ],
  exports: [
    RequestFormComponent,
  ],
  providers: [
    DatePipe
  ]
})
export class RequestModule {
}

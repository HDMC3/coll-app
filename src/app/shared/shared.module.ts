import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { MaxLengthPipe } from './pipes/max-length.pipe';

@NgModule({
    declarations: [
        ConfirmModalComponent,
        MaxLengthPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ConfirmModalComponent,
        MaxLengthPipe
    ]
})
export class SharedModule { }

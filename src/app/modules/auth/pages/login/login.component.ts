import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)]),
            password: new FormControl('', [Validators.required])
        });
    }

    ngOnInit(): void {
    }

    checkControlInvalid(controlName: string) {
        const control = this.loginForm.get(controlName);
        return control?.dirty && control?.invalid;
    }

    get emailMessageError() {
        let message = 'El correo es requerido';
        const control = this.loginForm.get('email');
        if (this.checkControlInvalid('email') && control?.errors?.['pattern']) {
            message = 'Debes ingresar un correo valido';
        }

        return message;
    }

    get passwordMessageError() {
        const message = 'La contraseña es requerida';
        return message;
    }

    controlValidationClasses(constrolName: string) {
        return {
            invalid: this.checkControlInvalid(constrolName)
        };
    }

}

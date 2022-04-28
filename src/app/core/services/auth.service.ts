import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private auth: AngularFireAuth) { }

    signIn(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    signOut() {
        return this.auth.signOut();
    }

    get currentUser() {
        return this.auth.user;
    }
}

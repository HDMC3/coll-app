import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @HostBinding('id') hostContainer = 'tasks-navbar';
    @ViewChild('userDropdown') userDropdown?: ElementRef;
    showSidebarPanel: boolean;
    showSidebarContainer: boolean;
    showUserMenu: boolean;
    currentUserSubscription?: Subscription;
    userEmail?: string | null;

    constructor(private authService: AuthService, private router: Router) {
        this.showSidebarPanel = false;
        this.showSidebarContainer = false;
        this.showUserMenu = false;
        this.userEmail = 'user email';
    }

    showSidebar() {
        this.showSidebarPanel = true;
        this.showSidebarContainer = true;
    }

    ngOnInit() {
        document.addEventListener('click', this.closeUserMenu);
        this.currentUserSubscription = this.authService.currentUser.subscribe(value => {
            this.userEmail = value?.email;
        });
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.closeUserMenu);
        this.currentUserSubscription?.unsubscribe();
    }

    hiddeSidebar(e: any) {

        if (e.target?.classList?.contains('sidebar-container') || e.target?.id === 'close-sidebar-button') {
            this.showSidebarPanel = false;
            setTimeout(() => {
                this.showSidebarContainer = false;
            }, 200);
        };
    }

    async logOut() {
        try {
            await this.authService.signOut();
            this.router.navigate(['/auth/login']);
        } catch (error) { }
    }

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
    }

    closeUserMenu = (e: any) => {
        if (!e.path.includes(this.userDropdown?.nativeElement)) {
            this.showUserMenu = false;
        }
    };

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  user: any = {username: '', password: ''};
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    const userData = {
      username: this.user.username,
      password: this.user.password,
      role: 'admin'
    }

    this.auth.adminLogin(userData).subscribe(
      (res: any) => {
        console.log('✅ Prijava uspješna:', res);
        this.auth.saveToken(res.token);
        this.router.navigate(['/']);
      },
      (err: any) => {
        console.log('❌ Greška pri prijavi:', err);
        alert('Neispravan username ili password!');
    })
  }

}

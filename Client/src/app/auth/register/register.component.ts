import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent  implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async onRegister() {
    const username = this.registerForm.get('username')?.value ? 'test' : 'test';
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;

    if (!username || !email || !password || !passwordConfirm) {
      await this.toastService.displayError('Моля въведи всички потребителски данни!');
      return;
    }

    if (password !== passwordConfirm) {
      await this.toastService.displayError('Паролите не съвпадат!');
      return;
    }

    try {
      await this.authService.register(email, password);
    } catch (e: any) {
      const msg = e.message.includes('credential') ? 'Грешни потребителски данни' : e.message;
      await this.toastService.displayError(msg);
    }
  }
}

import { SeoService } from 'src/app/shared/services';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { UserRepository, UserUpdateFormData } from 'src/app/core/state';
import { AuthRepository } from 'src/app/core/state/auth.repository';
import { TypedFormGroup } from 'src/app/shared/utils';

@UntilDestroy()
@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authRepository = inject(AuthRepository);
  private readonly userRepository = inject(UserRepository);
  private readonly seoService = inject(SeoService);
  settingForm!: TypedFormGroup<UserUpdateFormData>;

  ngOnInit(): void {
    this.initForm();
    this.loadSettingForm();
  }

  loadSettingForm(): void {
    this.authRepository.authUser$
      .pipe(
        filter((user) => !!user),
        untilDestroyed(this)
      )
      .subscribe((user) => {
        this.settingForm.patchValue({
          bio: user?.bio,
          email: user?.email,
          id: user?.id,
          username: user?.username,
        });
      });
  }

  initForm(): void {
    this.settingForm = new FormGroup({
      username: new FormControl('', {
        nonNullable: true,
      }),
      id: new FormControl(0, {
        nonNullable: true,
        validators: Validators.required,
      }),
      bio: new FormControl('', {
        nonNullable: true,
      }),
      email: new FormControl('', {
        nonNullable: true,
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
      }),
    });
  }

  submit(): void {
    if (this.settingForm.invalid) {
      return;
    }
    const { bio, email, id, newPassword, username } = this.settingForm.value;
    this.userRepository.updateUser({
      bio: bio!,
      email: email!,
      id: id!,
      newPassword: newPassword!,
      username: username!,
    });
    this.router.navigate(['']);
  }

  logout(): void {
    this.authRepository.logout();
    this.router.navigate(['/login']);
  }
}

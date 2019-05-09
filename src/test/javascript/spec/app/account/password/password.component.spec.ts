import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';

import { WarrantyappTestModule } from '../../../test.module';
import { PasswordComponent } from 'app/account/password/password.component';
import { PasswordService } from 'app/account/password/password.service';

describe('Component Tests', () => {
  describe('PasswordComponent', () => {
    let comp: PasswordComponent;
    let fixture: ComponentFixture<PasswordComponent>;
    let service: PasswordService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [WarrantyappTestModule],
        declarations: [PasswordComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PasswordComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(PasswordComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PasswordService);
    });

    it('should show error if passwords do not match', () => {
      // GIVEN
      comp.passwordForm.patchValue({
        newPassword: 'password1',
        confirmPassword: 'password2'
      });
      // WHEN
      comp.changePassword();
      // THEN
      expect(comp.doNotMatch).toBe('ERROR');
      expect(comp.error).toBeNull();
      expect(comp.success).toBeNull();
    });

    it('should call Auth.changePassword when passwords match', () => {
      // GIVEN
      const passwordValues = {
        currentPassword: 'oldPassword',
        newPassword: 'myPassword'
      };

      spyOn(service, 'save').and.returnValue(of(new HttpResponse({ body: true })));

      comp.passwordForm.patchValue({
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
        confirmPassword: passwordValues.newPassword
      });

      // WHEN
      comp.changePassword();

      // THEN
      expect(service.save).toHaveBeenCalledWith(passwordValues.newPassword, passwordValues.currentPassword);
    });

    it('should set success to OK upon success', function() {
      // GIVEN
      spyOn(service, 'save').and.returnValue(of(new HttpResponse({ body: true })));
      comp.passwordForm.patchValue({
        newPassword: 'myPassword',
        confirmPassword: 'myPassword'
      });

      // WHEN
      comp.changePassword();

      // THEN
      expect(comp.doNotMatch).toBeNull();
      expect(comp.error).toBeNull();
      expect(comp.success).toBe('OK');
    });

    it('should notify of error if change password fails', function() {
      // GIVEN
      spyOn(service, 'save').and.returnValue(throwError('ERROR'));
      comp.passwordForm.patchValue({
        newPassword: 'myPassword',
        confirmPassword: 'myPassword'
      });

      // WHEN
      comp.changePassword();

      // THEN
      expect(comp.doNotMatch).toBeNull();
      expect(comp.success).toBeNull();
      expect(comp.error).toBe('ERROR');
    });
  });
});

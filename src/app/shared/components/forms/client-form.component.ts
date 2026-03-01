import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  @Input() client: Client | null = null;
  @Input() isEditMode = false;
  @Output() onSubmit = new EventEmitter<Partial<Client>>();
  @Output() onCancel = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      nombre_local: [this.client?.nombre_local || '', [Validators.required, Validators.minLength(3)]],
      nombre_contacto: [this.client?.nombre_contacto || '', [Validators.required, Validators.minLength(3)]],
      email_contacto: [this.client?.email_contacto || '', [Validators.required, Validators.email]],
      telefono_contacto: [this.client?.telefono_contacto || '', [Validators.required, this.phoneValidator]],
      direccion_local: [this.client?.direccion_local || '', [Validators.required, Validators.minLength(5)]]
    });
  }

  private phoneValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  submit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.form.value;
    this.onSubmit.emit(formData);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (control.errors['minLength']) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minLength'].requiredLength} caracteres`;
    }
    if (control.errors['email']) {
      return 'Email inválido';
    }
    if (control.errors['invalidPhone']) {
      return 'Teléfono inválido';
    }

    return 'Campo inválido';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre_local: 'Nombre del Local',
      nombre_contacto: 'Nombre de Contacto',
      email_contacto: 'Email',
      telefono_contacto: 'Teléfono',
      direccion_local: 'Dirección'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}

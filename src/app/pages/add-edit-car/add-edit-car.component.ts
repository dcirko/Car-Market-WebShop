import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-car',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './add-edit-car.component.html',
  styleUrl: './add-edit-car.component.css'
})
export class AddEditCarComponent {
  carForm!: FormGroup;
  editMode: boolean = false;
  selectedFile: File | null = null;
  carId: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.carForm = this.fb.group({
      marka: ['', Validators.required],
      model: ['', Validators.required],
      godina: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      cijena: ['', [Validators.required, Validators.min(1)]],
      kilometraza: ['', [Validators.required, Validators.min(0)]],
      slika: ['', Validators.required],

      motor: ['', [Validators.required, Validators.min(500)]],
      snaga: ['', [Validators.required, Validators.min(50)]],
      boja: ['', Validators.required],
      gorivo: ['', Validators.required],
      mjenjac: ['', Validators.required],
      pogon: ['', Validators.required]
    });

   
    const savedCar = localStorage.getItem('editCar');
    if (savedCar) {
        this.editMode = true;
        const car = JSON.parse(savedCar);
        this.carId = car.id; 

      this.carForm.patchValue({
        marka: car.marka,
        model: car.model,
        godina: car.godina,
        cijena: car.cijena,
        kilometraza: car.kilometri
      });

      this.carForm.get('slika')?.clearValidators();
      this.carForm.get('slika')?.updateValueAndValidity();
    }
    
    if (!this.route.snapshot.paramMap.has('id')) {
      localStorage.removeItem('editCar');
    }

  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
        this.selectedFile = file;
        console.log('📸 Odabrana slika:', file);
    }
}


  onSubmit() {
    console.log('📝 Form submitted');
    if (this.carForm.valid) {
      const formData = new FormData();
      formData.append('marka', this.carForm.value.marka);
      formData.append('model', this.carForm.value.model);
      formData.append('godina', this.carForm.value.godina);
      formData.append('kilometraza', this.carForm.value.kilometraza);
      formData.append('cijena', this.carForm.value.cijena);

      formData.append('motor', this.carForm.value.motor);
      formData.append('snaga', this.carForm.value.snaga);
      formData.append('boja', this.carForm.value.boja);
      formData.append('gorivo', this.carForm.value.gorivo);
      formData.append('mjenjac', this.carForm.value.mjenjac);
      formData.append('pogon', this.carForm.value.pogon);

      if(this.selectedFile){
        formData.append('slika', this.selectedFile as File);
      }
      const carData = this.carForm.value;
      console.log('Auto podaci:', carData);

      if (this.editMode) {
          this.http.put(`http://localhost:3000/api/automobili/${this.carId}`, this.carForm.value).subscribe(() => {
          alert('✅ Auto uspješno ažuriran!');
          localStorage.removeItem('editCar');
          this.router.navigate(['/']);
        });
      } else {
          this.http.post('http://localhost:3000/api/automobili', formData).subscribe(() => {
          alert('✅ Auto uspješno dodan!');
          localStorage.removeItem('editCar');
          this.router.navigate(['/']);
        });
      }

      this.carForm.reset();
    } else {
      console.log('🚨 Form not valid');
  }
  }
}

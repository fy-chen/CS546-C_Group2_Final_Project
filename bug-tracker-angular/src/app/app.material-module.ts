import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
// since we're exporting these modules, add them to export
    exports: [
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatPaginatorModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatListModule,
        MatSnackBarModule
       
    ]
})
export class AppMaterialModule {}
import {RouterModule, Routes} from "@angular/router";
import {DataReaderComponent} from "./data-reader/data-reader.component";
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {path: 'upload', component: DataReaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { CardComponent } from './components/card/card.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ModalComponent } from './components/modal-confirm-register/modal.component';
import { ModalReservationComponent } from './components/modal-reservation/modal-reservation.component';
import { SearchAreaComponent } from './components/search-area/search-area.component';
import { ModalConfirmReservationComponent } from './components/modal-confirm-reservation/modal-confirm-reservation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HorizontalCardComponent } from './components/horizontal-card-reservation/horizontal-card.component';
import { HorizontalCardFavoriteComponent } from './components/horizontal-card-favorite/horizontal-card-favorite.component';
import { ModalConfirmDeleteResComponent } from './components/modal-confirm-delete-res/modal-confirm-delete-res.component';
import { ModalModifyResComponent } from './components/modal-modify-res/modal-modify-res.component';
import { ModalConfirmModifyComponent } from './components/modal-confirm-modify/modal-confirm-modify.component';
import { ModalUserModifyConfirmComponent } from './components/modal-user-modify-confirm/modal-user-modify-confirm.component';
import { DetailRestaurantComponent } from './components/detail-restaurant/detail-restaurant.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    FooterComponent,
    LoginComponent,
    NavBarComponent,
    HomeComponent,
    CardComponent,
    SearchResultsComponent,
    LandingPageComponent,
    ModalComponent,
    ModalReservationComponent,
    SearchAreaComponent,
    ModalConfirmReservationComponent,
    ProfileComponent,
    HorizontalCardComponent,
    HorizontalCardFavoriteComponent,
    ModalConfirmDeleteResComponent,
    ModalModifyResComponent,
    ModalConfirmModifyComponent,
    ModalUserModifyConfirmComponent,
    DetailRestaurantComponent
  ],
  imports: [
    HttpClientModule,
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, NgZone, Renderer2 } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { GlobalSettingsProvider } from "../../providers/global-settings/global-settings";
import { PibAuthProvider } from "../../providers/pib-auth/pib-auth";
import { LoginPage } from "../login/login";

/**
 * Generated class for the ClassroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-classroom",
  templateUrl: "classroom.html",
})
export class ClassroomPage {

  public node: string = "/classroom?pib_mobile=true";

  // Page URL is generated by appending the node to the global site URL.
  public pageUrl: SafeUrl;
  private loginPageOpened: boolean = false;
  private messageListener: () => void;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer,
              private settings: GlobalSettingsProvider, private platform: Platform, private renderer: Renderer2,
              private zone: NgZone, private pibAuth: PibAuthProvider) {

    const siteUrl = this.settings.siteUrl();
    const url = siteUrl + this.node;
    console.log(url);
    this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.platform.ready().then(() => {

      this.updateUrl("/accounts/blank");

      this.messageListener = this.renderer.listen(window, "message", (evt) => {
        this.receiveMessage(evt);
      });
    });
  }

  private receiveMessage(evt) {
    console.log("login receive");
    console.log("receiving message: " + JSON.stringify(evt.data));
    console.log("loginPageOpened " + this.loginPageOpened);
    switch (evt.data.message) {

      case "loginInfo":
        const loggedInNow = this.pibAuth.isLoggedIn(evt.data.data);
        if (loggedInNow) {
          this.messageListener();
          this.updateUrl("/classroom/?pib_mobile=true");
        } else if (!this.loginPageOpened) {
          this.loginPageOpened = true;
          this.navCtrl.push(LoginPage, {
            goBack: true,
          });
        }
        break;
    }

  }

  private updateUrl(url: string) {
    this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.settings.siteUrl() + url);
    this.zone.run(() => {});
  }
}
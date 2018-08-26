import { Component, ViewChild } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { IonicPage, MenuController, NavController, NavParams, Platform } from "ionic-angular";
import { GlobalSettingsProvider } from "../../providers/global-settings/global-settings";

/**
 * Generated class for the DiscussionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-discussion",
  templateUrl: "discussion.html",
})
export class DiscussionPage {

  public node: string = "/discussion?pib_mobile=true";

  // Page URL is generated by appending the node to the global site URL.
  public pageUrl: SafeUrl;
  public navbarIcon: string = "menu";
  @ViewChild("mainObject") public mainObject: any;
  public mainObjectElement: any;
  private navLength: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer,
              private globalSettingsProvider: GlobalSettingsProvider, private menuCtrl: MenuController,
              private platform: Platform) {

    const siteUrl = globalSettingsProvider.siteUrl();
    const url = siteUrl + this.node;
    console.log(url);
    this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    window.addEventListener("message", (event) => {
      const eventData = event.data;
      if (eventData.message === "pagePushed") {
        this.pagePush(eventData.historyLength);
      }
    });
  }

  public pagePush(length: number) {
    console.log("pagePushed");
    this.navLength = length;
    this.navbarIcon = "arrow-back";
  }

  public ngAfterViewInit() {
    this.mainObjectElement = this.mainObject.nativeElement;
    const backAction =  this.platform.registerBackButtonAction(() => {
      this.mainObjectElement.contentWindow.postMessage("goBack", "*");
      backAction();
    }, 2);
  }
}

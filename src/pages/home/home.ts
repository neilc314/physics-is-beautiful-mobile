import { Component, Renderer2, ViewChild } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NativeAudio } from "@ionic-native/native-audio";
import { Events, NavController, Platform } from "ionic-angular";
import { GlobalSettingsProvider } from "../../providers/global-settings/global-settings";
import { PibAuthProvider } from "../../providers/pib-auth/pib-auth";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {

  public node: string = "/curriculum?pib_mobile=true";

  // Page URL is generated by appending the node to the global site URL.
  public pageUrl: SafeUrl;
  public navbarIcon: string = "menu";

  @ViewChild("mainObject") public mainObject: any;
  public mainObjectElement: any;
  private messageListener: () => void;

  constructor(public navCtrl: NavController, public platform: Platform, private renderer: Renderer2,
              public globalSettingsProvider: GlobalSettingsProvider, private sanitizer: DomSanitizer,
              private nativeAudio: NativeAudio, public events: Events, private pibAuth: PibAuthProvider) {

    const siteUrl = globalSettingsProvider.siteUrl();
    const url = siteUrl + this.node;
    this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.messageListener = this.renderer.listen(window, "message", (event) => {
      console.log(event.data);
      if (["audioComplete", "audioContinue", "audioCorrect", "audioDoubleRainbow", "audioExamCorrect",
      "audioExamStart", "audioIncorrect"].indexOf(event.data) > -1) {
        console.log(event.data);
        this.nativeAudio.play(event.data).then(null, (error) => {
          console.log(error);
      });
      } else if (event.data.message === "loginInfo") {
        this.pibAuth.processLoginData(event.data.data);
      }
    });
  }

  public ngAfterViewInit() {
    this.mainObjectElement = this.mainObject.nativeElement;
    const backAction =  this.platform.registerBackButtonAction(() => {
      this.mainObjectElement.contentWindow.postMessage("goBack", "*");
    }, 2);

    this.events.publish("component:updateNav");
  }

  public ionViewWillLeave() {
    this.messageListener();
    console.log("home message listener removed");
  }
}

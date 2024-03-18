import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  listening = false;
  searchQuery!: string;

  constructor(private platform: Platform) { }

  async ngOnInit() {
    await SpeechRecognition.requestPermissions();
  }

  onSearch(event: any) {
    this.search.emit(event.detail.value);
  }

  async onStartListening() {
    const {available} = await SpeechRecognition.available();

    if (available) {
      this.listening = true;
      console.log(await SpeechRecognition.getSupportedLanguages());
      await SpeechRecognition.start({
        language: "en-US",
        partialResults: true,
        popup: true,
        prompt: "Say location address"
      });

      SpeechRecognition.addListener("partialResults", async (data) => {
        console.log('results');
        // console.log(await translate(data.matches[0], 'bg'));
      });
    }
  }

  async onStopListening() {
    this.listening = false;
    await SpeechRecognition.stop();
  }
}

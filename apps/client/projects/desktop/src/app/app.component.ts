import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";
import { ButtonComponent } from "@lib/ui";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, ButtonComponent],
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  greetingMessage = "";

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    invoke<string>("greet", { name })
      .then((text) => {
        this.greetingMessage = text;
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }
}

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "lib-button",
  template: `
    <button type="button" class="rounded bg-green-600 px-3 py-1.5 text-white">
      {{ label() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly label = input.required<string>();
}

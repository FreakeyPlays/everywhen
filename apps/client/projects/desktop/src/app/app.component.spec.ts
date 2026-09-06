import { TestBed } from "@angular/core/testing";
import { invoke } from "@tauri-apps/api/core";
import { AppComponent } from "./app.component";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

describe("App", () => {
  beforeEach(async () => {
    vi.mocked(invoke).mockReset();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("starts without a greeting", () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.greetingMessage).toBe("");
  });

  it("submits the entered name without navigating and displays the native greeting", async () => {
    vi.mocked(invoke).mockResolvedValue("Hello, Ada!");
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector("input")!.value = "Ada";
    const event = new Event("submit", { bubbles: true, cancelable: true });

    element.querySelector("form")!.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(invoke).toHaveBeenCalledExactlyOnceWith("greet", { name: "Ada" });
    await fixture.whenStable();
    expect(element.querySelector("p")?.textContent).toBe("Hello, Ada!");
  });

  it("reports a native failure and preserves the previous greeting", async () => {
    const error = new Error("Native greeting failed");
    vi.mocked(invoke).mockRejectedValue(error);
    const reportError = vi.spyOn(console, "error").mockImplementation(() => {});
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.greetingMessage = "Hello, Ada!";

    fixture.componentInstance.greet(new SubmitEvent("submit", { cancelable: true }), "Grace");

    await vi.waitFor(() => expect(reportError).toHaveBeenCalledExactlyOnceWith(error));
    expect(fixture.componentInstance.greetingMessage).toBe("Hello, Ada!");
  });
});

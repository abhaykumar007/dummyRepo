import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import CurrentWeather from "@/pages/dashboard/weather/currentWeather/currentWeather";

describe("Current weather", () => {
    let store: any;
    let consoleErrorMock: any;
    let consoleWarnMock: any;
    beforeAll(() => {
      consoleErrorMock = jest
        .spyOn(console, "error")
        .mockImplementation(() => {
          return
          // if (JSON.stringify(message)?.includes("findDOMNode is deprecated")) {
          //   return;
          // }
        });
      consoleWarnMock = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {
          return;
        });
    });
  
    afterAll(() => {
      consoleErrorMock.mockRestore();
      consoleWarnMock.mockRestore();
    });
    beforeEach(() => {
      store = setupDefaultStore({
       farms:{
        selectedFarmId: null,
        selectedFarmWeather: {
            current:null,
            forecast:null
        }
       }
      });
    });

    test("should give loader", () => {
        renderWithProvider(<CurrentWeather />, {store});
        expect(document.querySelector("[data-testid='loader']")).toBeInTheDocument();
    });

    // test("should ")
})


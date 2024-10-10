export const iconRenderError = jest
  .spyOn(console, "error")
  .mockImplementation((message) => {
    if (message.includes("findDOMNode is deprecated")) {
      return;
    }
  });

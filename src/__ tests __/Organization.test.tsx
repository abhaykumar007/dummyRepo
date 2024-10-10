import Organization from "@/pages/organization";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import { setupDefaultStore } from "./utils/setupTests";
import { renderWithProvider } from "./utils/testUtils";
import OrganizationActions from "@/redux/organization/actions";
import { getTranslation } from "@/translation/i18n";

const mockOrganizations: any[] = [
  { organisationId: "1", organisationName: "Org1", logo: "logo1.png" },
  { organisationId: "2", organisationName: "Org2", logo: "logo2.png" },
];

describe("Organization Component", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("Renders Organization component without crashing", () => {
    renderWithProvider(<Organization />, { store });

    expect(
      screen.getByText(getTranslation("organization.selectYourOrganization"))
    ).toBeInTheDocument();
  });

  test("Displays organizations when loaded", () => {
    store = setupDefaultStore({
      organizations: {
        organisations: mockOrganizations,
        selectedOrganisationId: null,
      },
    });

    renderWithProvider(<Organization />, { store });

    expect(screen.getByText("Org1")).toBeInTheDocument();
    expect(screen.getByText("Org2")).toBeInTheDocument();
  });

  test("Handles organization selection", () => {
    store = setupDefaultStore({
      organizations: {
        organisations: mockOrganizations,
        selectedOrganisationId: null,
      },
    });

    renderWithProvider(<Organization />, { store });

    const orgCard = screen.getByText("Org2");
    fireEvent.click(orgCard);

    expect(store.dispatch).toHaveBeenCalledWith(
      OrganizationActions.selectOrganization(
        mockOrganizations[1].organisationId
      )
    );
  });

  test("Displays error message when there is an error", () => {
    store = setupDefaultStore({
      error: {
        [OrganizationActions.REQUEST_ORGANIZATION_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });

    renderWithProvider(<Organization />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("Does not display tick for unselected organizations", () => {
    store = setupDefaultStore({
      organizations: {
        organisations: mockOrganizations,
        selectedOrganisationId: null,
      },
    });

    renderWithProvider(<Organization />, { store });

    expect(screen.queryByTestId("selected_organization_tick")).toBeNull();
  });
});

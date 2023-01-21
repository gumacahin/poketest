describe("Pokemon test app", () => {
  it("should load the login page", () => {
    cy.visit("/");
  });

  it("should allow login", function () {
    const username = "tester";

    cy.visit("/");

    cy.get("#username").type(username);

    cy.get("#login").click();
  });
});

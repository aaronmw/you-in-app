/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/eCFTAkpHU3IkpFg2pcZ3');
  });

  // https://on.cypress.io/interacting-with-elements

  it('.click() - click on a DOM element', () => {
    cy.get('button').contains('Create new Objective').click({ force: true });
    cy.get('[data-modal-layer-type="window"]').as('modal');
    cy.get('@modal')
      .find('button')
      .contains('Select Customer')
      .click({ force: true });
    cy.wait(200);
    cy.get('[data-modal-layer-type="menu"]').as('menu');
    cy.get('@menu').find('input:focus').type('Aaron W');
    cy.get('@menu').find('input:focus').type('{command}1');
    cy.wait(200);
    cy.get('@modal')
      .find('button')
      .contains('Select Team(s)')
      .click({ force: true });
    cy.get('[data-modal-layer-type="menu"]').as('menu');
    cy.get('@menu').find('button').contains('Design').click({ force: true });
  });
});

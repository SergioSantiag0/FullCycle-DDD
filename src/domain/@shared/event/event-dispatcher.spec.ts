import Customer from "../../customer/entity/customer";
import CustomerChangedAddressEvent from "../../customer/event/customer-changed-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import ShowFirstMessageWhenCustomerIsCreatedHandler from "../../customer/event/handler/show-first-message-when-customer-is-created.handler";
import ShowMessageWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/show-message-when-customer-addresss-is-changed.handler";
import ShowSecondMessageWhenCustomerIsCreatedHandler from "../../customer/event/handler/show-second-message-when-customer-is-created.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });


  it("should notify when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new ShowFirstMessageWhenCustomerIsCreatedHandler();
    const secondEventHandler = new ShowSecondMessageWhenCustomerIsCreatedHandler();
    const spyFirstEventHandler = jest.spyOn(firstEventHandler, "handle");
    const spySecondEventHandler = jest.spyOn(secondEventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(firstEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(secondEventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({      
      id: "123",
      name: "Sérgio Santiago"
    });

    // Quando o notify for executado o ShowFirstMessageWhenCustomerIsCreatedHandler.handle() e ShowSecondMessageWhenCustomerIsCreatedHandler deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyFirstEventHandler).toHaveBeenCalled();
    expect(spySecondEventHandler).toHaveBeenCalled();
  });


  it("should notify when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ShowMessageWhenCustomerAddressIsChangedHandler();
    
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);
    
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = new Customer("123", "Sérgio Santiago");
    const address = new Address("Rua 1", 123, "12345-678", "São Paulo");  
    customer.changeAddress(address);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent(customer);

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
    
  });
});
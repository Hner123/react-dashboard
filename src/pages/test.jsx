<Modal show={showModal} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
  <Modal.Header closeButton>
    <Modal.Title style={{ fontSize: '20px' }}>
      <p className="mb-0">Booking Details </p>
      <CalendarResched />
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>{/* ************ BODY******************* */}</Modal.Body>
  <Modal.Footer>
    <Button variant="outline-secondary">Reschedule</Button>
    <Button variant="outline-primary">Checkout</Button>
  </Modal.Footer>
</Modal>;

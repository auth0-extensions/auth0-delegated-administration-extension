import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import Error from '../../../client/components/Error';

describe('#Client-Components-Error', () => {
  const getAlert = (container) => container.querySelector('.alert');
  const getCloseButton = (container) => container.querySelector('button.close');

  it('renders nothing when show is false', () => {
    const { container } = render(<Error show={false} message="boom" />);

    expect(getAlert(container)).to.be.null;
  });

  it('renders a danger alert with the default title and the message', () => {
    const { container } = render(<Error message="boom" />);
    const alert = getAlert(container);

    expect(alert).to.exist;
    expect(alert).to.have.class('alert-danger');
    expect(alert.querySelector('strong')).to.have.text('Oh snap!');
    expect(alert.textContent).to.contain('boom');
  });

  it('renders a custom title', () => {
    const { container } = render(<Error title="Uh oh!" message="boom" />);

    expect(getAlert(container).querySelector('strong')).to.have.text('Uh oh!');
  });

  it('renders a close button', () => {
    const { container } = render(<Error message="boom" />);

    expect(getCloseButton(container)).to.exist;
  });

  it('renders children (not an alert) when there is no message', () => {
    const { container } = render(<Error><span className="child">hi</span></Error>);

    expect(getAlert(container)).to.be.null;
    expect(container.querySelector('span.child')).to.exist;
  });

  it('dismisses the alert when the close button is clicked', () => {
    const { container } = render(<Error message="boom" />);
    expect(getAlert(container)).to.exist;

    fireEvent.click(getCloseButton(container));

    expect(getAlert(container)).to.be.null;
  });

  it('invokes the onDismiss callback when the close button is clicked', () => {
    let called = 0;
    const { container } = render(<Error message="boom" onDismiss={() => { called += 1; }} />);

    fireEvent.click(getCloseButton(container));

    expect(called).to.equal(1);
  });

  it('re-shows a dismissed alert when a new error message arrives', () => {
    const { container, rerender } = render(<Error message="boom" />);
    fireEvent.click(getCloseButton(container));
    expect(getAlert(container)).to.be.null;

    rerender(<Error message="a different boom" />);
    const alert = getAlert(container);

    expect(alert).to.exist;
    expect(alert.textContent).to.contain('a different boom');
  });

  it('keeps a dismissed alert hidden while the same message persists', () => {
    const { container, rerender } = render(<Error message="boom" />);
    fireEvent.click(getCloseButton(container));
    expect(getAlert(container)).to.be.null;

    rerender(<Error message="boom" />);

    expect(getAlert(container)).to.be.null;
  });
});

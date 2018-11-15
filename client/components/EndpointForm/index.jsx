import React, { Component, PropTypes } from 'react';
import { InputText } from 'auth0-extension-ui';

import Editor from '../Editor';
import './customEndpointForm.css';

export default class EndpointTab extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    handler: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isNew: PropTypes.bool.isRequired,
    activeTab: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      handler: props.handler
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name || this.props.handler !== nextProps.handler) {
      this.setState({
        name: nextProps.name,
        handler: nextProps.handler
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.activeTab !== nextProps.activeTab ||
      this.props.handler !== nextProps.handler ||
      this.state.name !== nextState.name;
  }

  onChange = type => (value) => {
    this.setState({
      [type]: value.target ? value.target.value : value
    });
  };

  onSave = (e) => {
    e.preventDefault();
    const { id, onSave, isNew } = this.props;
    const { name, handler } = this.state;

    onSave(id, name, handler, isNew);
  };

  onDelete = () => {
    const { id, onDelete } = this.props;

    onDelete(id);
  };

  render() {
    const { isNew } = this.props;
    const input = { required: true, value: this.state.name, onChange: this.onChange('name') };

    return (
      <form onSubmit={this.onSave} >
        <div className="col-xs-3">Path: </div>
        <div className="col-xs-9">{`${window.config.BASE_URL}/api/custom/${this.state.name}`} </div>
        <div className="endpoint-name">
          <InputText name="endpoint-name" label="Name:" placeholder="new-endpoint" input={input} />
        </div>
        <Editor name="handler" value={this.state.handler} onChange={this.onChange('handler')} />
        <div className="endpoints-control">
          <button type="submit" className="btn btn-success pull-right">{isNew ? 'Create' : 'Update'} Endpoint</button>
          {isNew ? '' : <button type="reset" onClick={this.onDelete} className="btn btn-danger pull-right">Remove</button>}
        </div>
      </form>
    );
  }
}

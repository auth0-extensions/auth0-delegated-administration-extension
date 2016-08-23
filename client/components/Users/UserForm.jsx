import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel, InputCombo, InputText, Confirm } from '../Dashboard';
import _ from 'lodash';

export default class ApplicationForm extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }
    const user = this.props.user.toJS();
    return <div className="updateAppScreen">
      <form className="appForm updateAppForm" onSubmit={(e) => {
        e.preventDefault();
        var arr = $('.appForm').serializeArray(), obj = {};
        $.each(arr, function(indx, el){
          obj[el.name] = el.value;
        });
        this.props.updateUser(user.user_id,obj, function() {
          history.back();
        });
      }}>
        <div className="form-group row">
          <label htmlFor="user_nickname">Username</label>
          <div className="col-xs-10">
            <input placeholder="" name="nickname" id="user_nickname" className="form-control" type="text" defaultValue={user.nickname} required />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="user_email">Email?</label>
          <div className="col-xs-10">
            <input placeholder="" name="email" id="user_email" className="form-control" type="text" defaultValue={user.email} required />
          </div>
        </div>
      <br />
      <div className="btn-div">
      <button className="btn btn-info">Save Profile Settings</button>
      </div>
      </form>
    </div>
  }
}

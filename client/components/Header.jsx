import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import './Header.styles.css';

export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    getDictValue: PropTypes.func,
    accessLevel: PropTypes.object,
    issuer: PropTypes.string,
    onLogout: PropTypes.func.isRequired,
    onCssToggle: PropTypes.func.isRequired,
    renderCssToggle: PropTypes.bool,
    styleSettings: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  };

  getName(iss, user) {
    let thisMenuName = this.props.getDictValue('menuName');

    // thisMenuName = thisMenuName || (user && user.get('name'));
    // thisMenuName = thisMenuName || (user && user.get('nickname'));
    // thisMenuName = thisMenuName || (user && user.get('email'));
    thisMenuName = thisMenuName || iss;

    return thisMenuName.length >= 21 ? thisMenuName.substr(0,18)+'...' : thisMenuName;
  }

  getPicture(iss, user) {
    // if (user && user.get('picture')) {
    //   return user.get('picture');
    // }

    // if (user && user.get('nickname')) {
    //   return `https://cdn.auth0.com/avatars/${user.get('nickname').slice(0, 2).toLowerCase()}.png`;
    // }

    return `https://cdn.auth0.com/avatars/${iss.slice(0, 2).toLowerCase()}.png`;
  }

  showOnFocus() {
    document.querySelector('#navbar-collapse li.dropdown').classList.add('open');
  }

  hideOnBlur() {
    document.querySelector('#navbar-collapse li.dropdown').classList.remove('open');
  }

  onKeyUp = (event) => {
    if (event && event.key === 'Enter') {
      event.target.click();
    }
  };

  renderCssSwitcher(languageDictionary) {
    if (this.props.renderCssToggle) {
      const toggleTextDefault = languageDictionary.toggleStyleSetDefault || 'Use Default Style';
      const toggleTextAlt = languageDictionary.toggleStyleSetAlternative || 'Use Alternative Style';
      const text = this.props.styleSettings.get('useAlt') ? toggleTextDefault : toggleTextAlt;
      return (
        <li role="presentation">
          <a role="menuitem" onClick={this.props.onCssToggle} onFocus={this.showOnFocus} onBlur={this.hideOnBlur} onKeyUp={this.onKeyUp} tabIndex="0">
            {text}
          </a>
        </li>
      );
    }

    return '';
  }

  getMenu(isAdmin, languageDictionary) {
    if (!isAdmin) {
      return (
        <ul role="menu" className="dropdown-menu">
          {this.renderCssSwitcher(languageDictionary)}
          <li role="presentation">
            <a role="menuitem" onClick={this.props.onLogout} onFocus={this.showOnFocus} onBlur={this.hideOnBlur} onKeyUp={this.onKeyUp} tabIndex="0">
              {languageDictionary.logoutMenuItemText || 'Logout'}
            </a>
          </li>
        </ul>
      );
    }

    return (
      <ul role="menu" className="dropdown-menu">
        <li role="presentation">
          <Link to="/users" onFocus={this.showOnFocus} onBlur={this.hideOnBlur}>
            {languageDictionary.usersAndLogsMenuItemText || 'Users & Logs'}
          </Link>
        </li>
        <li role="presentation">
          <Link to="/configuration" onFocus={this.showOnFocus} onBlur={this.hideOnBlur}>
            {languageDictionary.configurationMenuItemText || 'Configuration'}
          </Link>
        </li>
        {this.renderCssSwitcher(languageDictionary)}
        <li role="presentation">
          <a role="menuitem" onClick={this.props.onLogout} onFocus={this.showOnFocus} onBlur={this.hideOnBlur} onKeyUp={this.onKeyUp} tabIndex="0">
            {languageDictionary.logoutMenuItemText || 'Logout'}
          </a>
        </li>
      </ul>
    );
  }

  renderTitle = (isAdmin) => {
    if (isAdmin && window.config.AUTH0_MANAGE_URL) {
      return <a className="navbar-brand" href={window.config.AUTH0_MANAGE_URL}>{this.props.getDictValue('title', window.config.TITLE)}</a>;
    }

    return <span className="navbar-brand">{this.props.getDictValue('title', window.config.TITLE)}</span>;
  };

  render() {
    const { user, issuer, accessLevel } = this.props;
    const languageDictionary = this.props.languageDictionary || {};
    const isAdmin = accessLevel.role === 3;
    return (
      <header className="dashboard-header">
        <nav title="header" role="navigation" className="navbar navbar-default">
          <div className="container">
            <div id="header" className="navbar-header" style={{ width: '800px' }}>
              {this.renderTitle(isAdmin)}
            </div>
            <div id="navbar-collapse" className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                  <li className="dropdown">
                  <span role="button" data-toggle="dropdown" data-target="#" className="btn-dro btn-username">
                    <img
                      role="presentation"
                      src={this.getPicture(issuer, user)}
                      className="picture avatar"
                      alt={languageDictionary.adminAvatarTitle || 'Avatar'}
                      title={languageDictionary.adminAvatarTitle || 'Avatar'}
                    />
                    <span className="username-text">
                      {this.getName(issuer, user)}
                    </span>
                    <i className="icon-budicon-460"></i>
                  </span>
                  {this.getMenu(isAdmin, languageDictionary)}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

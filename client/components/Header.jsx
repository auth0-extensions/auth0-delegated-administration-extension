import './Header.css';
import React, { Component } from 'react';
import { NavigationLink } from '../components/Dashboard';

export default class Header extends Component {
  static propTypes = {
    user: React.PropTypes.object,
    appSettings: React.PropTypes.object,
    accessLevel: React.PropTypes.object,
    issuer: React.PropTypes.string,
    onLogout: React.PropTypes.func.isRequired
  };

  getPicture = (iss, user) => {
    if (user && user.get('picture')) {
      return user.get('picture');
    }
    if (user && user.get('nickname')) {
      return `https://cdn.auth0.com/avatars/${user.get('nickname').slice(0, 2).toLowerCase()}.png`;
    }
    return `https://cdn.auth0.com/avatars/${iss.slice(0, 2).toLowerCase()}.png`;
  }

  render() {
    const { user, issuer, onLogout, accessLevel, appSettings } = this.props;
    const showMenu = accessLevel.role === 2;
    const title = (appSettings.get('settings') && appSettings.get('settings').get('dict')) ? appSettings.get('settings').get('dict').get('title') : '';
    return (
      <header className="dashboard-header">
        <nav role="navigation" className="navbar navbar-default">
          <div className="container">
            <div id="header" className="navbar-header" style={{ width: '800px' }}>
              <a className="navbar-brand" href="#">{title || window.config.TITLE}</a>
            </div>
            <div id="navbar-collapse" className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <span role="button" data-toggle="dropdown" data-target="#" className="btn-dro btn-username">
                    <img role="presentation" src={this.getPicture(issuer, user)} className="picture avatar" />
                    <span className="username-text">
                      {issuer}
                    </span>
                    <i className="icon-budicon-460"></i>
                  </span>
                  {showMenu ?
                    <ul role="menu" className="dropdown-menu">
                      <NavigationLink title="Users & Logs" route="/users" icon="" />
                      <NavigationLink title="Configuration" route="/configuration" icon="" />
                      <li role="presentation">
                        <a href="#" role="menuitem" tabIndex="-1" onClick={onLogout}>
                          Logout
                        </a>
                      </li>
                    </ul>
                    :
                    <ul role="menu" className="dropdown-menu">
                      <li role="presentation">
                        <a href="#" role="menuitem" tabIndex="-1" onClick={onLogout}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  }
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

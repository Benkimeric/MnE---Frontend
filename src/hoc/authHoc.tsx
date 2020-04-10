import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AuthenticationHelper from '../helpers/authentication';
import Socket from '../helpers/socket';
import { loginUserSuccess } from '../redux/actionCreator/userActions';

interface Props {
  history: any;
  setCurrentUser: any;
}

export default function(ComposedComponent: any) {
  const Authenticate: any = (props: Props) => {
    const { history, setCurrentUser } = props;

    const token = localStorage.getItem('jwt-token');

    const verifyToken = () => {
      const decodedToken: any = AuthenticationHelper.decodeToken();
      const msg = 'Session Expired. Login to continue';
      const { exp, userInfo } = decodedToken;
      if (AuthenticationHelper.isExpired(exp)) {
        localStorage.setItem('url', history.location.pathname);
        AuthenticationHelper.logoutUser(history, msg);
        return false;
      }
      setCurrentUser(userInfo);
      Socket()
      return true;
    };
    useEffect(() => {
      if (token) {
        verifyToken();
      } else {
        localStorage.setItem('url', window.location.pathname);
        return AuthenticationHelper.logoutUser(
          history,
          'Session Expired. Login to continue'
        );
      }
      return () => {};
    });

    return token && <ComposedComponent />;
  };

  Authenticate.defaultProps = {
    history: {},
  };

  const actionCreators = {
    setCurrentUser: loginUserSuccess,
  };

  return connect(null, actionCreators)(Authenticate);
}

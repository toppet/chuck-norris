import { useLocation, useHistory } from 'react-router-dom';
import './Success.scss';

function Success() {
  const location = useLocation<any>();
  const history = useHistory();

  const renderEmailList = () => {
    return location.state.emails.map((email, index) => <span className="email-badge" key={index}>{email}</span>);
  }
  const goBackHome = () => {
    history.replace("/");
  }

  const renderRequestError = () => {

    return (
      <div className="error">
        <h1>There was a problem with your request please start all over again.</h1>
        <button className="back-btn" onClick={goBackHome}>Back to home</button>
      </div>
    );
  }

  const renderContent = () => {
    if(!location || !location.state){
      return renderRequestError();
    }

    if(!location.state.emails || location.state.emails.length === 0) {
      return renderRequestError();
    }

    return (
      <div className="success-page-content">
        <h1>Congratulations, Chuck Norris approves your humor!</h1>
        <img src="https://i.pinimg.com/originals/b4/d0/bc/b4d0bc7a0a9a9d6f34274e7be5eabfe1.gif" alt="chuck norris" />
        <h2>The joke have been successfully sent to the following addresses:</h2>
        <div className="email-list">
          { renderEmailList() }
        </div>
        <button type="button" className="restart-btn" onClick={goBackHome}>Restart</button>
      </div>
    );
  }

  return(
    
    <div className="SuccessPage">
      {renderContent()}
    </div> 
  )
}

export default Success;
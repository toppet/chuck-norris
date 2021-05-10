import { useCallback, useEffect, useState } from "react";
import { ContactSupport, Loop, Delete, Send } from '@material-ui/icons';
import { useForm } from "react-hook-form";
import _ from 'lodash';

import './Home.scss';
import { useHistory } from "react-router";

enum SORTVALUES {
  domain = "domain",
  name = "name",
};

type FormInputs = {
  email: string,
};

interface IChuckNorris {
  type: string,
  value: {
    id: string,
    joke: string,
    categories: Array<string>
  },
}

const loadingMessages = [
  "Just a sec. Looking for a joke!",
  "Let me get you something funny...",
  "Hmm... Let's see what we can get!",
  "I think I have just the right one for you.",
  "It shouldn't take too long now...",
  "I found a good one you are going like!",
  "You'll see, this next one is hilarious!",
  "Please be patient, it's loading.",
  "Buckle your seatbelt for this one!"
]

function Home() {
  const history = useHistory();
  const [joke, setJoke] = useState<String>('');
  const [loading, setLoading] = useState<Boolean>(true);
  const [emails, setEmails] = useState<Array<String>>([]);
  const [selectedSortBy, setSelectedSortBy] = useState<String>(SORTVALUES.domain);
  const { register, handleSubmit, formState, reset } = useForm<FormInputs>({ mode: "onChange" });

  //// API RELATED CODEPART ////
  // Call the api
  const callJokeApi = (): Promise<IChuckNorris> => {
    const url = 'http://api.icndb.com/jokes/random';
    return fetch(url)
       .then(resp => resp.json())
       .then(data => data);
  };

  const getJoke = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 500));
      const apiResponse: IChuckNorris = await callJokeApi();
      const joke = apiResponse.value.joke.replace(/&quot;/g,'"'); // quickfix for the &quot; to being displayed correctly
      setJoke(joke);
    } catch (error) {
      setJoke(`ERROR: ${error.message} 😭`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getJoke();
  }, [getJoke]);  
  
  //// ==== FORM RELATED CODEPART ==== ////
  const addEmail = (formValues: FormInputs) => {
    // get the email string from the form object
    const { email }  = formValues;
    
    // Create new array with the new email address, then sort the values base on the currently selected sorting type
    const newEmailList = [...emails, email];
    sortBySelectedRadio(selectedSortBy, newEmailList);
    
    // clear the form
    reset();
  };

  const removeEmail = (emailToRemove: String) => {
    // RESET to default value
    if(emails.length === 1) {
      setSelectedSortBy(SORTVALUES.name);
    }
    setEmails(emails => emails.filter(email => email !== emailToRemove));
  }

  const sortByDomain = (arrayToSortByDomain: Array<String>) => {
    const splitValues = [...arrayToSortByDomain].map(email => {
      const [name, domain] = email.split('@');
      return { name, domain };
    });

    const sortedByDomain = _.sortBy(splitValues, (email) => email.domain).map(value => `${value.name}@${value.domain}`);

    return sortedByDomain;
  }
  
  const sortByName = (arrayToSortByName: Array<String>) => {
    const sortedByName = _.sortBy(arrayToSortByName);
    return sortedByName;
  }

  const sortBySelectedRadio = (sortByValue: String, arrayToSort: Array<String>) => {
    let sortedEmails = [];

    switch(sortByValue) {
      case SORTVALUES.domain:
        sortedEmails = sortByDomain(arrayToSort);
        break;
      case SORTVALUES.name: 
        sortedEmails = sortByName(arrayToSort);
        break;
    }

    setEmails(sortedEmails);
  }

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedSortBy(value);
    sortBySelectedRadio(value, emails);
  }

  //// ==== REDIRECT RELATED CODEPART ==== ////
  const sendEmails = async () => {
    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ emails })
    // };
    // try {
    //   const response = await fetch('/api', requestOptions);
    //   const data = await response.json();
    // === Do something after the request succeeded. === // 
    // } catch (error) {
    //   console.error('Error', error);
    // }

    history.push('/success', { emails });
  }
  
  //// ======================================== ////
  //// ============  RENDER HTML  ============= ////
  //// ========================================////

  const createEmailListItem = (email, index) => {
    return <p className="email-list-item" key={index}>{email} <Delete className="delete-item" onClick={() => removeEmail(email)}/></p>;
  }

  const getLoadingMessage = () => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }

  return (
    <div className="Home">
      
      <section className="joke-wrap">
        <div className="joke-container">
          { loading ? <p className="loading-message">{getLoadingMessage()}</p> : <p className="joke-text">{joke}</p> }
          <button className="fetch-button" onClick={() => getJoke()}>Give me another <Loop className={(loading ? "spinner" : "")}/></button>
        </div>
      </section> {/* joke-wrap */}

      <section className="email-wrap" >
          <div className="mailing-list-form">
            
            <form onSubmit={handleSubmit(addEmail)}>
              <div className="email-form">
                {/* register email input into the hook by invoking the "register" function */}
                <input className="email" placeholder="example@gmail.com" {...register("email", { required: true, pattern: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/ })} />
                <button type="submit" className="add-email-btn" disabled={!formState.isValid}>Add email</button>
              </div>              
              {/* errors will return when email field validation fails  */}
              {formState.errors.email?.type === 'required' && <span className="input-error">This field is required</span>}
              {formState.errors.email?.type === 'pattern' && <span className="input-error">Invalid email address</span>}
            </form>

            <div className="hidden-when-empty" hidden={emails.length === 0}>

              <div className="sorting-wrap">
                <span>Sort by:</span>
                <div className="radio-group">
                  <input type="radio" id="domain" disabled={emails.length <= 1} checked={selectedSortBy === SORTVALUES.domain} value={SORTVALUES.domain} onChange={handleRadioChange} />
                  <label htmlFor="domain">Domain</label>
                  <input type="radio" id="name" disabled={emails.length <= 1} checked={selectedSortBy === SORTVALUES.name} value={SORTVALUES.name} onChange={handleRadioChange} />
                  <label htmlFor="name">Name</label>
                </div>
              </div>

              <div className="email-list">
                { emails.map((email,index) => createEmailListItem(email, index))}
              </div>

              <button type="button" className="send-joke-btn" onClick={sendEmails}>Send joke <Send/></button>
            </div>
          </div>

          <div className="info-container">
            <div className="info-box">
              <ContactSupport className="info-icon"/>
              <div className="info-text">
                <p>Surprise your friends and family with an awesome Chuck Norris joke!</p>
                <p>Just add some email addresses to the mailing list and click the send button.</p>
                <p>It's that easy!</p>
              </div>
            </div>
          </div>
      </section> {/* email-wrap */}
    </div>
  );
}

export default Home;
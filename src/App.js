import { useState } from 'react';
import './App.css';
import { END } from './constants/gsafe';
import { generate_signed_data, send_to_gnosis_safe } from './services/gnosis';

function App() {
  const [signF, setSignF] = useState('click button to generate');
  const [signB, setSignB] = useState('click button to generate');
  const gen_sign = async end => {
    const sign = await generate_signed_data(end);
    end === END.FRONT ?
    setSignF(sign.I) :
    setSignB(sign.I);
  }

  const transact = async end => {
    const r = end === END.BACK ?
    (await send_to_gnosis_safe(signB)) : null;
    console.log('tx result:', r);
  }
  return (
    <div className="App">
      <br/>
      <br/>
      <label htmlFor="sign_info">Sign (frontend):</label>
      &nbsp;&nbsp;
      <span id='sign_info'>{signF}</span>
      <br/>
      <br/>
      <label htmlFor="sign_info">Sign (backend):</label>
      &nbsp;&nbsp;
      <span id='sign_info'>{signB}</span>
      <br/>
      <br/>
      <button onClick={_ => gen_sign(END.FRONT)}>Generate Sign! (frontend)</button>
      <br/>
      <br/>
      <button onClick={_ => gen_sign(END.BACK)}>Generate Sign! (backend)</button>
      <br/>
      <br/>
      <button onClick={_ => transact(END.BACK)}>Send to Gnosis Safe! (backend)</button>
    </div>
  );
}

export default App;

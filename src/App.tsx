import { useState } from 'react';
import './App.css'
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function App() {
  
  return (
    <>
    <h1>Hugging face demos</h1>
    <Routes>
    <Route path="/" element={<Layout/>}>
    <Route index element={<Home/>}/>
    <Route path="text-to-image" element={<TextToImage/>} />
    <Route path="dashboard" element={<Dashboard/>} />
    <Route path="*" element={<NoMatch/>} />
    
    </Route>
    </Routes>

    </>
  )
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul className="navigation">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/text-to-image">Text to Image</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>



      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  async function query(data) {

	const response = await fetch(
		"https://api-inference.huggingface.co/models/google-t5/t5-base",
		{
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}


  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    console.log(formData.get('input'))
    setIsLoading(true);
    const inputs = `translate ${formData.get('srcLang')} to ${formData.get('tgtLang')}: ${formData.get('input')}`;
    query({inputs}).then((response) => {
	      console.log(JSON.stringify(response));
      setIsLoading(false);
      if(response.error) {
        setTranslation(`Error: ${response.error}`) 
      } else {
        setTranslation(response[0].translation_text);
      }
      });
  }

  const languages = [
    "English",
    "French",
    "German",
    "Romanian"
  ]

  const [targetLangs, setTargetLangs] = useState(languages.filter(lang => lang !== "English"));

  const handleSrcLangChange = (ev) => {
    console.log(ev.target.value);
    const val = ev.target.value;
    setTargetLangs(languages.filter(lang => lang !== val))
  }
    
  return (
    <div>
    <h2>Translation</h2>
    <form onSubmit={handleSubmit}>
    <p>From: <select name="srcLang" onChange={handleSrcLangChange}>
    <option>English</option>
    <option>French</option>
    <option>German</option>
    </select>
    </p>
    <p>To: <select name="tgtLang">
    { targetLangs.map(lang => <option>{lang}</option>)}
    </select>
    </p>
    <p>
    <textarea name="input" rows="5"></textarea>
    </p>
    <p><button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : 'Translate'}</button></p>
    </form>
    <h2>{translation}</h2>

    </div>
  );
}

function TextToImage() {
  return (
    <div>
      <h2>Text to Image</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App

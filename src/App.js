import axios from "axios";
import { useState } from "react";
import './App.css'
import TableList from "./component/TableList";

export default function App() {

   const [depen, setscripts] = useState({});
  const [FormDetails, setFormDetails] = useState({});

  const [Do, setDo] = useState(false);
  const [error, setError] = useState(false);


  const onhangeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormDetails(prevState => ({
      ...prevState,
      [name]: value
    }))
  }


  const getpackage = (e) => {
    e.preventDefault();
    axios({
      method: "get",
      url:
        `https://api.github.com/repos/${FormDetails.repoOwner}/${FormDetails.repoName}/contents/package.json?ref=master`,
      headers: { "Content-Type": "application/vnd.github.v3.raw" }
    })
      .then(async (res) => {
        let urlA = res.data.download_url;
        // fetching json from file 
        axios({
          method: "get",
          url: urlA,
          headers: { "Content-Type": "application/json" }
        }).then((resr) => {

          //check If dependency or devDependency
          if (resr.data.dependencies) {
                setscripts(resr.data.dependencies);
                setDo(true);
                setError(false);
          } else if (Object.keys(resr.data.devDependencies).length > 0) {
                setscripts(resr.data.devDependencies);
                setDo(true);
                setError(false);
          }
          else {
            setDo(false);

          }
        });

      })
      .catch((err) => {
        setError(true); 
        setDo(false)
      });
  };



  return (
    <div className="App pt-3 pb-5">
      <div className="container bg-lisht text-center pt-2">
        <h1>Get Dependency List</h1>
        <div className="mb-3 text-left mt-3  w-center">
          <input type="text" className="form-control w-c" name="repoOwner" onChange={onhangeHandler} placeholder="Owner Name" />
        </div>
        <div className="mb-3  w-center">
          <input type="text" className="form-control w-c" name="repoName" onChange={onhangeHandler} placeholder="Repo Name" />
        </div>
        {
          (error) && 
          <div> <div className="alert alert-danger w-25 w-center" role="alert">
            Repo Not Found  </div> </div>
        }
        <button onClick={getpackage} className="btn butonCls">Submit</button>
      </div>
      {
        (Do) ? <TableList data={depen} /> : <div></div>
      }
    </div>
  );
}

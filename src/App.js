import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import PrivateComponent from './components/PrivateComponent';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import UpdateProduct from './components/UpdateComponent';


function App() {
  return (
    <div className="App">
    <BrowserRouter>
       <Nav />
   <Routes>
   
   <Route element={<PrivateComponent/>}>
   <Route path='/' element={<h1>{<ProductList/>}</h1>}/>
   <Route path='/add' element={<h1>{<AddProduct/>}</h1>}/>
   <Route path='/update/:id' element={<h1>{<UpdateProduct/>}</h1>}/>
   <Route path='/logout' element={<h1>Logout Listing Component</h1>}/>
   <Route path='/profile' element={<h1>Profile Component</h1>}/>
   </Route>

   <Route path='/signup' element = {<SignUp/>} />
   <Route path='/login' element = {<Login/>} />

   </Routes> 
    </BrowserRouter>
    </div>
  );
}

export default App;

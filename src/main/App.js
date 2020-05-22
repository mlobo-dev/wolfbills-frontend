import React from 'react';
import Rotas from './rotas'
import NavBar from '../components/navbar'

import 'toastr/build/toastr.min.js'

import 'bootswatch/dist/flatly/bootstrap.css'
import '../custom.min.css'
import 'toastr/build/toastr.css'
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ProvedorAutenticacao from './ProvedorAutenticacao';

class App extends React.Component {

  render() {
    return (
      <ProvedorAutenticacao>
        <NavBar />
        <div className="container">
          <Rotas />
        </div>
      </ProvedorAutenticacao>
    )
  }

}

export default App;

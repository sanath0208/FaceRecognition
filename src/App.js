import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: 'd51af0e229654eaf9d1e6f2387643833'
 });

const particlesOptions = {
  particles: {
        number: {
          value:100,
          density: {
            enable: true,
            value_area: 800
          }
        }
}};

class App extends Component{
    constructor(){
      super();
      this.state = {
        input:'',
        imageUrl: '',
        box: {}
      }
    }

    onInputChange = (event) =>{
      this.setState({input:event.target.value});
    }

    calculateFaceLocation = (data) =>{
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

    displayBox = (box) =>{
      console.log(box);
      this.setState({box:box});
    }

    onSubmit = () =>{

      this.setState({imageUrl:this.state.input});
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>this.displayBox(this.calculateFaceLocation(response)))
      .catch( err =>console.log(err));
    }

  render(){
    return (
      <div className="App">
      <Particles className='particles' params={particlesOptions}/>
          <Navigation/>
          <Logo/>
          <Rank/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
    );
  }
}

export default App;

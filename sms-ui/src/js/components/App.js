import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import fetch from 'whatwg-fetch';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: null
    };
  }

  onDrop(files) {
    var reader  = new FileReader();

    console.log('files', files);
    if (!files) {
      return;
    }

    const preview = files[0].preview;
    console.log("preview", preview);
    this.setState({
      preview: preview
    });


    this.toDataURL(preview)
      .then(base64File => {
        console.log("base64Data:", base64File);
        return this.apiClassify(base64File.split(",")[1]);
      });
  }

  getPreview() {
    if (!this.state.preview) {
      return null;
    }

    return (
      <img src={this.state.preview}></img>
    );
  }

  toDataURL(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  apiClassify(base64Image) {
    const url = `http://lewd.local:8080/classify/`;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", "Token df0b88dce8e9f7ee1104c77c37df116e2e2525ee");

    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Request finished. Do processing here.
            var response = JSON.parse(this.responseText);
            console.log(response);
            window.alert(`Results: ${this.responseText}`);
        }
    }
    xhr.onerror = function() {
      console.log("error!");
    }
    xhr.send(JSON.stringify({
      image: base64Image
    }));
  }

  getDropzone() {
    return (
      <Dropzone onDrop={(files) => this.onDrop(files)} multiple={false}>
        <div>Drop or select a .jpeg file to upload!.</div>
      </Dropzone>
    );
  }

  render() {
    return (
      <div>
        <h1>Welcome to EweTube</h1>
        <p>Upload a picture to get started</p>
        {this.getDropzone()}
        {this.getPreview()}
      </div>
    )
  }
}

export default App;

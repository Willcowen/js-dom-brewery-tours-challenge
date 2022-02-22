 const options = {
      // We want to send an HTTP POST (GET is the default for fetch)
      method: 'POST', 
      //We need to tell the server we are sending JSON
      headers : {
        'Content-Type' : 'application/json'
      },
      //Specify the request body: the data we want to send with the request. In this
      //case we are send a JavaScript object as a JSON string using JSON.stringify
      body: JSON.stringify({
        age: 12,
        name: 'Another person'
      })
    }

    //Pass in the options object from above
    fetch("http://localhost:3000/people", options)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      //This is where we do stuff with the response! In this case 
      //we just log it out.
      console.log("Person created", json)
    })

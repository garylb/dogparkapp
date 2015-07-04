/*
 * 
 */

var requestData = function(url, onSuccess) {
    var request = new XMLHttpRequest();

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        onSuccess(request);
      } else {
        // We reached our target server, but it returned an error
        console.log("REQUEST ERROR: " + request.status);
      }
    };

    request.onerror = function(err) {
      // There was a connection error of some sort
      console.log("ERROR: " + err);
    };

    request.open('GET', url, true);
    request.send();
}


var ListDisplayItem = React.createClass({
	render: function() {
		return (
			<div className="listItem">
                <h2>{this.props.value.parkName}</h2>
				<image src={this.props.value.photos[0]} />
			</div>
		);
	}
});

var ListDisplay = React.createClass({
 	getInitialState: function() {
          return {
          	parks: []
          };
        },
    componentDidMount: function() {
        //console.log(this.props.source);
        requestData(this.props.source, function(result) {
            //console.log(result);
            if (this.isMounted()) {
                this.setState({
                    parks: JSON.parse(result.responseText)
                });
            }
        }.bind(this));
    },
    render: function() {
    	var displayItems = {};
    	var i = 0;
    	this.state.parks.forEach(function(parkData){
    		displayItems[i] = <ListDisplayItem value={parkData} />
    		++i;
    	});

    	return (
    		<div className="board">
    			{displayItems}
    		</div>
    	);
    }
});

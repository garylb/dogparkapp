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
                <h2>{this.props.num, '. ', this.props.value.parkName}</h2>
				<image src={this.props.value.photos[0]} />
			</div>
		);
	}
});

var ListDisplay = React.createClass({
    render: function() {
    	var displayItems = {};
    	var i = 0;
    	this.props.parks.forEach(function(parkData, i){
    		displayItems[i] = <ListDisplayItem value={parkData} key={'li',i} num={i+1} />
    		++i;
    	});

    	return (
    		<div className="board">
    			{displayItems}
    		</div>
    	);
    }
});

var ActionIcon = React.createClass({
    render: function() {
        return (
                <button className={'iconHolder '+this.props.actionClass} onClick={this.props.action} >
                    <i className='icon material-icons md-48'>{this.props.iconType}</i>
                </button>
            );
    }
});

var AppHeader = React.createClass({
    render: function() {
        return (
                <div className='appHeader'>
                    <ActionIcon iconType={this.props.toggleDisplay} actionClass='stateIcon' action={this.props.toggleAction} />
                    <h1>{this.props.title}</h1>
                </div>
            );
    }
});

var SearchMap = React.createClass({
    getInitialState: function(){
        console.log(this.props);
        return {'foo':'bar'};
    },
    render: function() {
        var getCoords = function(parkInfo) {
            return parkInfo.lat + ',' + parkInfo.long;
        };

        var centerPos = this.props.latitude + ',' + this.props.longitude;
        var markerPos = [this.props.parks.length];
        this.props.parks.forEach(function(parkInfo, i){
            markerPos[i] = getCoords(parkInfo);
        });
        var visibleUrlParams = markerPos.join('|');

        var markersUrlParams = '';
        markerPos.forEach(function(pos, i){
            markersUrlParams += '&markers=label:'+(i+1)+'|'+pos;
        });

        return (
                <div className='searchMapContainer'>
                    <img src={'https://maps.googleapis.com/maps/api/staticmap?center=' + centerPos + '&size=400x300&scale=2&visible=' + visibleUrlParams + markersUrlParams} />
                </div>
            );
    }
});

var DogParkApp = React.createClass({
    getInitialState: function() {
        return {
            mode:'getLocation',
            latitude:'',
            longitude:''
        };
    },
    componentDidMount: function() {
        React.initializeTouchEvents(true);

        if ("geolocation" in navigator) {
          /* geolocation is available */
          navigator.geolocation.getCurrentPosition(function(pos){
            if (this.isMounted()) {
                this.setState({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    mode:'listDisplay'
                });
            } 
          }.bind(this), function(err){
            console.log(JSON.stringify(err));
          })
        } else {
          /* geolocation IS NOT available */
        }
        requestData(this.props.source, function(result) {
            //console.log(result);
            if (this.isMounted()) {
                this.setState({
                    parks: JSON.parse(result.responseText)
                });
            }
        }.bind(this));
    },
    handleModeToggle: function() {
        var desiredMode;
        if (this.state.mode === 'listDisplay') {
            desiredMode = 'mapDisplay';
        } else {
            desiredMode = 'listDisplay';
        }

        if (this.isMounted()) {
            this.setState({
                mode:desiredMode
            });
        } 
    },
    render: function() {
        var contents = {};
        if (this.state.mode === 'getLocation') {
            contents = (
                <div>
                    <h2>Getting Location</h2>
                </div>
                );
        } else if (this.state.mode === 'mapDisplay') {
            contents = (
                <SearchMap parks={this.state.parks} latitude={this.state.latitude} longitude={this.state.longitude} />
                );
        } else {
            contents = (
                <ListDisplay parks={this.state.parks} />
                );
        }

        var modeToggleDisplay = this.state.mode === 'mapDisplay'?'list':'map';

        return (<div id="appContainer">
                    <AppHeader title={this.props.title} toggleDisplay={modeToggleDisplay} toggleAction={this.handleModeToggle} />
                    <div id="contentsContainer">
                        {contents}
                    </div>
                </div>
        );
    }
});

React.render(
    <DogParkApp title="Wagz" source="/api/dogParks" />,
    document.getElementById('example')
);

/*
React.render(
    <ListDisplay source="/api/dogParks" />,
    document.getElementById('example')
);
*/
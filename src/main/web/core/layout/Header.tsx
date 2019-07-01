import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';

export default class Header extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <h3 style={{marginBottom: '5px'}}>Full Text Search Visualization </h3>
                <h3 style={{margin: '0px'}}><small style={{marginLeft: '5px'}}> Author: Hooman Kamran</small></h3>
            </div>
        );
    }
}

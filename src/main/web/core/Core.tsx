import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';

import Body from './layout/Body';
import Footer from './layout/Footer';
import Header from './layout/Header';
import Navigation from './layout/Navigation';

import CoreStore from './stores/core/CoreStore';

import HomeScene from '../home/HomeScene';

export default class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public componentWillMount() {
        CoreStore.register();
    }

    public render() {
        return (
            <div>
                <Header />
                <Navigation />
                <Body>
                    <Router>
                        <Route exact path='/' component={HomeScene} />
                    </Router>
                </Body>
                <Footer />
            </div>
        );
    }
}
